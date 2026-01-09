import { IUser } from "../app/domain/model/user-interface";

export class UserDataHandler {
    constructor(private userData?: IUser) { }

    storeData() {
        localStorage.setItem('userData', JSON.stringify(this.userData));
    }

    getUserStored() {
        const raw = localStorage.getItem('user');
        try {
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error('Erro ao parsear dados do usuário:', e);
            return null;
        }

    }

    getUserName(): string {
        const raw = localStorage.getItem('user');
        if (!raw) {
            return '';
        }
        try {
            const user = JSON.parse(raw);
            return user?.name ?? '';
        } catch (error) {
            console.error('Erro ao fazer parse do user:', error);
            return '';
        }
    }
}