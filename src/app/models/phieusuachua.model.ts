export class Phieusuachua {
    constructor(
        public bienso: string,
        public ngaysuachua: {
            day: string,
            month: string,
            year: string
        },
        public tongtien: number,
        public idphieusuachua?: string,
        public thutienstt?: boolean,
        public isdelete?: boolean
    ) {}
}
