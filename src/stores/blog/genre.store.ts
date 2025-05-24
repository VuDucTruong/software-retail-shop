import {z} from "zod";
import {ApiClient, BaseAction, BaseState, setLoadAndDo} from "@/api";
import {create} from "zustand";

const GenreBaseSchema = z.object({
    id: z.number(),
    name: z.string()
})

export namespace Api{
    namespace Genre2{
        export const Schema = GenreBaseSchema
    }
    export namespace Genre1 {
        export const ResponseSchema = GenreBaseSchema.extend({
            genres: z.array(Genre2.Schema)
        })
        export const ResponseSchemaList = z.array(ResponseSchema)
        export type Response = z.infer<typeof Genre1.ResponseSchema>
    }
    export const client = ApiClient.getInstance();
}




export namespace GenreDomain {
    export const Genre2Schema = GenreBaseSchema
    const Genre1Schema = GenreBaseSchema.extend({
        genre2s: z.array(Genre2Schema),
    })
    export type Genre2Type = z.infer<typeof Genre2Schema>
    export type Genre1Type = z.infer<typeof Genre1Schema>

    export type State = BaseState & {
        genre1s: Genre1Type[],
        genre2s: Genre2Type[]
    }
    type Action = BaseAction & {
        getGenre1s: () => Promise<void>
    }

    export type Store = State & Action
    const initialState : State = {error: null, genre1s: [], genre2s: [], lastAction: null, status: 'loading'}
    export const useStore =  create<GenreDomain.Store>((set,get)=>({
        ...initialState,
        proxyLoading(run, lastAction = null){
            setLoadAndDo(set, run, lastAction);
        },
        getGenre1s: async (): Promise<void> => {

            if (get().genre1s.length === 0) {
                const responseGenre1: Api.Genre1.Response[] = await Api.client.get(
                    "/genres",
                    Api.Genre1.ResponseSchemaList,
                );
                const genre1s = responseGenre1.map(s => ({
                    id: s.id,name: s.name,
                    genre2s: s.genres.map(g2 => ({ ...g2 }))
                }));
                const genre2s = genre1s.flatMap(s=>s.genre2s)
                set({ genre1s: genre1s, genre2s: genre2s, status: 'success', error: null });
            }
        }
    }))

}
