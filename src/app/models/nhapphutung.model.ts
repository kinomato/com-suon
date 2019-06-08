export class Nhapphutung {
    constructor(
        public ngaynhap: {
            day: string,
            month: string,
            year: string
        },
        public tongtien: number,
        public idnhappt?: string,
        public isdelete?: boolean
    ) { }
}
