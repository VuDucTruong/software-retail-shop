import {
    ApiClient,
    BaseAction,
    BaseState,
    BLOG_FALL_BACK,
    BlogCreateRequest,
    BlogDomainType,
    BlogPaginationResponseSchema,
    BlogResponseSchema,
    BlogResponseType,
    BlogsGenre1Responses,
    BlogUpdateRequest,
    defaultAsyncState,
    DisposeAction,
    Pageable,
    QueryParams,
    setLoadAndDo
} from "@/api"
import {undefined, z} from "zod";


import {create} from "zustand";
import {useUserStore} from "@/stores/user.store";
import {fallbackProfile} from "@/lib/fallback_values";
import {flattenObject} from "@/lib/utils";
import {ApiError} from "@/api/client/base_client";

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
        approvedAt: response.approvedAt,
        deletedAt: response.deletedAt,
        title: response.title ?? 'ok',
        subtitle: response.subtitle ?? 'anonymouse',
        content: response.content ?? '',
        author: response.author ?? {id: 1, fullName: 'anonymous', createdAt: '', imageUrl: ''},
        genre2Ids: response.genre2Ids || [],
        imageUrl: response.imageUrl,
        publishedAt: response.publishedAt
    }
}

export namespace BlogSingle {
    export type State = BaseState & {
        blog: BlogDomainType,
    }

    export type Action = BaseAction & DisposeAction & {
        getById: (id: number, includeDeleted?: boolean) => Promise<void>
        approveBlog(id: number, isApproved: boolean): Promise<void>
        createBlog: (data: BlogCreateRequest) => Promise<void>;
        updateBlog: (data: BlogUpdateRequest) => Promise<void>;
        /// may be delete as well;
    }

    export type Store = State & Action;
    export const initialState: State = {
        ...defaultAsyncState,
        blog: BLOG_FALL_BACK
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
        async approveBlog(id: number, isApproved: boolean) {
            const response = await BlogApis.approveById(id, isApproved);
            if (response < 1)
                throw new ApiError("No Changes made");
            const domain = {...get().blog};
            domain.approvedAt = isApproved ? new Date().toLocaleString() : null;
            set({blog: domain})
        },
        updateBlog: async (request: BlogUpdateRequest) => {
            const response = await BlogApis.updateBlogById(request);

            let imageUrl: string;
            if (request.image)
                imageUrl = response?.imageUrl ?? "/empty_img.png"
            else
                imageUrl = get().blog?.imageUrl ?? "/empty_img.png"

            const domain: BlogDomainType = {
                author: get()?.blog?.author || fallbackProfile,
                title: request.title,
                content: request.content,
                genre2Ids: request.genreIds,
                id: request.id,
                publishedAt: request.publishedAt,
                subtitle: request.subtitle,
                imageUrl
            }
            set({blog: domain})
        },
        clean() {
            set({...initialState})
        }
    }));
}

export namespace BlogMany {
    type State = BaseState & Pageable & {
        blogs: BlogDomainType[];
    }

    type Action = BaseAction & DisposeAction & {
        getBlogs: (query: QueryParams) => Promise<void>;
        approveBlog(id: number, action: boolean): Promise<void>

        deleteBlogs: (ids: number[]) => Promise<void>;
        deleteById: (id: number) => Promise<void>,
    }
    type BlogStore = State & Action;

    const initialState: State = {
        blogs: [],
        totalInstances: 0,
        totalPages: 0,
        currentPage: 0,
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

    export const useStore = create<BlogStore>((set, get) => ({
                ...initialState,
                proxyLoading(run, lastAction) {
                    setLoadAndDo(set, run, lastAction)
                },
                async approveBlog(id: number, isApproved: boolean) {
                    const response = await BlogApis.approveById(id, isApproved);
                    if (response < 1)
                        throw new ApiError("No Changes made");
                    const updatedBlogs = get().blogs.map(blog =>
                        blog.id === id ? {...blog, approvedAt: isApproved ? new Date().toLocaleString() : null} : blog
                    );
                    set({blogs: updatedBlogs})
                },
                getBlogs: async (query) => {
                    const response = await BlogApis.getBlogs(query);
                    const domains: BlogDomainType[] = response.data.map(b => mapFromResponseToDomain(b));
                    set({
                        blogs: domains,
                        totalInstances: response.totalInstances,
                        totalPages: response.totalPages,
                        currentPage: response.currentPage
                    })
                },
                deleteBlogs: async (ids) => {
                    await BlogApis.deleteBlogs(ids)
                    const {blogs, totalInstances, totalPages, currentPage} = get();
                    set({
                        blogs: blogs.filter(d => ids.some(id => id !== d.id)),
                        totalInstances, totalPages, currentPage,
                    })
                },
                async deleteById(id: number) {
                    await BlogApis.deleteById(id);
                    const newBlogs = get().blogs.filter(b => b.id !== id)
                    const {totalInstances} = get();
                    set({blogs: newBlogs, totalInstances: totalInstances - 1,})
                },
                clean() {
                    set({...initialState})
                    console.log("clearing in blog many", get().blogs)
                }
            }
        ))
    ;

    export const useStoreLight = create<BlogStore>((set, get) => {

        const x: BlogStore = {
            ...initialState,
            proxyLoading(run, lastAction) {
                setLoadAndDo(set, run, lastAction)
            },
            getBlogs: async (query) => {
                const response = await BlogApis.getBlogs(query);
                const domains: BlogDomainType[] = response.data.map(b => mapFromResponseToDomain(b));
                set({
                    blogs: domains,
                    totalInstances: response.totalInstances,
                    totalPages: response.totalPages,
                    currentPage: response.currentPage
                })
            },
            async deleteBlogs(ids: number[]): Promise<void> {
                void ids;
            },
            async deleteById(id: number): Promise<void> {
                void id;
            },
            async approveBlog(id: number, action: boolean): Promise<void> {
                void id; void action;
            },
            clean() {
                set({...initialState})
                console.log("clearing in blog many", get().blogs)
            }
        }
        return x;
    })

}

export namespace BlogGroups {
    type State = BaseState & {
        g1IdToBlogs: Record<number, BlogDomainType[]>;
    }

    type Action = BaseAction & DisposeAction & {
        getBlogsPartitionByG1Id: (g1Ids: number[]) => Promise<void>;
    }

    const initialState: State = {
        g1IdToBlogs: {},
        ...defaultAsyncState,
    }
    type Store = State & Action

    export const useStore = create<Store>((set) => ({
        ...initialState,
        proxyLoading(run, lastAction = null) {
            setLoadAndDo(set, run, lastAction)
        },
        clean() {
            set({...initialState})
        },
        async getBlogsPartitionByG1Id(g1Ids) {
            const blogsPartitionedResponses = await BlogApis.getPartitionByG1Ids(g1Ids);
            const g1IdToBlogs: Record<number, BlogDomainType[]> = {};
            blogsPartitionedResponses.forEach(partition => {
                g1IdToBlogs[partition.id] = partition.blogs.map(b => mapFromResponseToDomain(b));
            })
            set({g1IdToBlogs: g1IdToBlogs})
        }
    }))


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

    export const getPartitionByG1Ids = async (g1Ids: number[]) => {
        return await apiClient.get("/genres/blogs", BlogsGenre1Responses, {
            params: {
                ids: g1Ids.join(","),
                size: 10
            }
        })
    }
    // set({ status: "loading", lastAction: "create" });
    export const createBlog = async (data: BlogCreateRequest): Promise<BlogResponseType> => {
        return apiClient.post("/blogs", BlogResponseSchema, flattenObject(data), {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }
    export const updateBlogById = async (data: BlogUpdateRequest): Promise<BlogResponseType> => {
        return apiClient.put("/blogs", BlogResponseSchema, flattenObject(data), {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }
    export const deleteById = async (id: number) => {
        const response = await apiClient.delete(`/blogs/${id}`, z.number(),);
        if (response < 1) {
            throw new ApiError("No blogs deleted");
        }
    }

    export async function approveById(id: number, approved: boolean) {
        return await apiClient.put(`/blogs/approval/${id}`, z.number(), undefined, {
            params: {
                approved: approved
            }
        })
    }

}



