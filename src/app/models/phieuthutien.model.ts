export class Phieuthutien {
    constructor(
        public tenchuxe: string,
        public bienso: string,
        public hieuxe: string,
        public dienthoai: string,
        public diachi: string,
        public ngaythutien: {
            day: string,
            month: string,
            year: string,
        },
        public sotienthu: number,
        public idphieuthutien?: string,
        public isdelete?: boolean
    ) {}
}
