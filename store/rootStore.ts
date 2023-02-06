import userStore, { IUserStore } from './userStore';

export interface IStore {
  user: IUserStore,
}
export default function createStore(initialValue: any): () => IStore {
  return () => {
    return {
        user: { ...userStore(), ...initialValue?.user }, //先用userStore进行初始化，再用initialvalue里的user信息进行覆盖
    };
  };
}