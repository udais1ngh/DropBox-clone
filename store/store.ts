
import {create} from 'zustand';

interface AppState {

    fileId : string | null ;
    setFileId : (fileId : string) =>void;


    isDeleteModel : boolean;
    setIsDeleteModal : (open : boolean) =>void;
}

export const useAppStore = create<AppState>((set)=>({
    fileId:null,
    setFileId:(fileId:string) => set((state)=>({fileId})),

    isDeleteModel:false,
    setIsDeleteModal:(open)=>set((state)=>({isDeleteModel:open})),
}))

