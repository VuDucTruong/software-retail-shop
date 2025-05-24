import {
    ApiClient,
    BaseAction,
    BaseState,
    BlogCreateRequest,
    BlogDomainList,
    BlogDomainType,
    BlogPaginationResponseSchema,
    BlogResponseSchema,
    BlogResponseType,
    BlogUpdateRequest,
    defaultAsyncState,
    Pageable,
    QueryParams,
    setLoadAndDo
} from "@/api"
import {z} from "zod";


import {create} from "zustand";
import {GenreDomain} from "./genre.store";
import {useUserStore} from "@/stores/user.store";
import {fallbackProfile} from "@/lib/fallback_values";

// namespace BlogAPI{
//
// }

const apiClient = ApiClient.getInstance();

const fallbackBlog: BlogDomainType = {
    id: 1,
    imageUrl: "empty_img",
    author: fallbackProfile,
    publishedAt: new Date().toISOString(),
    genre2Ids: [],
    content: '',
    subtitle: '',
    title: ''
}

const mapFromResponseToDomain = (response: BlogResponseType): BlogDomainType => {
    return {
        id: response.id,
        title: response.title ?? 'ok',
        subtitle: response.subtitle ?? 'anonymouse',
        content: response.content ?? '',
        author: response.author ?? {id: 1, fullName: 'anonymous', createdAt: '', imageUrl: ''},
        genre2Ids: response.genre2Ids || [],
        imageUrl: '',
        publishedAt: new Date().toISOString()
    }
}


export namespace BlogSingle {
    export type State = BaseState & {
        id: null | number,
        blog: BlogDomainType | null,
    }

    export type Action = BaseAction & {
        getById: (id: number, includeDeleted?: boolean) => Promise<void>
        createBlog: (data: BlogCreateRequest) => Promise<void>;
        updateBlog: (data: BlogUpdateRequest) => Promise<void>;
        /// may be delete as well;
    }
    export type Store = State & Action;
    export const initialState: State = {
        ...defaultAsyncState,
        id: null,
        blog: null
    }

    export const useStore = create<Store>((set, get) => ({
        ...initialState,
        proxyLoading(run, lastAction = null) {
            setLoadAndDo(set, run, lastAction);
        },
        getById: async (id, includeDeleted: boolean = false) => {
            const response = await BlogApis.geBlogtById(id, includeDeleted)
            const domain: BlogDomainType = mapFromResponseToDomain(response);
            set({blog: domain})
        },
        createBlog: async (request: BlogCreateRequest): Promise<void> => {
            const response = await BlogApis.createBlog(request);
            const profile = useUserStore.getState().selectedUser?.profile;
            const domain: BlogDomainType = {
                ...(get().blog ?? fallbackBlog),
                author: profile ?? fallbackProfile,
                imageUrl: response.imageUrl,
            }
            set({blog: domain})
        },
        updateBlog: async (request: BlogUpdateRequest) => {
            const response = await BlogApis.updateBlogById(request);
            const domain: BlogDomainType = {
                ...(get().blog ?? fallbackBlog),
                imageUrl: response.imageUrl,
            }
            set({blog: domain})
        },

    }));
}

export namespace BlogMany {
    type State = BaseState & Pageable & {
        blogs: BlogDomainList | null;


        genres: GenreDomain.Genre2Type[] | null;
    }

    type Action = {
        getBlogs: (query: QueryParams) => Promise<void>;
        deleteBlogs: (ids: number[]) => Promise<void>;
        getById: (id: number, includeDeleted: boolean) => Promise<void>

    }
    type BlogStore = State & Action;

    const initialState: State = {
        blogs: null,
        totalInstances: 0,
        totalPages: 0,
        genres: null,
        ...defaultAsyncState,
        queryParams: {
            pageRequest: {
                page: 0,
                size: 10,
                sortBy: "createdAt",
                sortDirection: "desc",
            },
        }
    }

    export const useStore = create<BlogStore>((set) => ({
        ...initialState,
        getBlogs: async (query) => {
            const response = await BlogApis.getBlogs(query);
            const domains = response.data.map(b => mapFromResponseToDomain(b));
            set({blogs: domains})
        },
        deleteBlogs: async (ids) => {
            const response = await BlogApis.deleteBlogs(ids)
            set({blogs: []})
        },
        getById: async (id, includeDeleted: boolean = false) => {
            console.log(' NOT DOING ANYTHING NOW')
            const response = await BlogApis.geBlogtById(id, includeDeleted)
            const domain: BlogDomainType = mapFromResponseToDomain(response);
            // set({blog: domain})
        },
    }));

}


export namespace BlogApis {

    // set({status: "loading", lastAction: null});
    export const geBlogtById = async (id: number, deleted: boolean): Promise<BlogResponseType> => {
        return apiClient.get(`/blogs/${id}`, BlogResponseSchema, {params: {deleted}})

    }
    // set({status: "loading", lastAction: null,queryParams: query});
    export const getBlogs = async (query: QueryParams) => {
        // set({ status: "loading", lastAction: null });
        return apiClient.post("/blogs/searches", BlogPaginationResponseSchema, query);
    }

    // set({status: "loading", lastAction: "delete"});
    export const deleteBlogs = async (ids: number[]) => {
        const response = await apiClient.delete("/blogs", z.number(), {
            params: {
                ids: ids.join(","),
            }
        });
        if (response < 1) {
            throw new Error("No blogs deleted");
        }
    }

    // set({ status: "loading", lastAction: "create" });
    export const createBlog = async (data: BlogCreateRequest): Promise<BlogResponseType> => {
        return apiClient.post("/blogs", BlogResponseSchema, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }
    export const updateBlogById = async (data: BlogUpdateRequest): Promise<BlogResponseType> => {
        return apiClient.put("/blogs", BlogResponseSchema, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }

}



