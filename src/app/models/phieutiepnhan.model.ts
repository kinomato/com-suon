export class Phieutiepnhan {
    constructor(
        public ngaytiepnhan: {
            day: string,
            month: string,
            year: string
        },
        public bienso: string,
        public hieuxe: string,
        public idkhachhang: string,
        public suachuastt: boolean,
        public tiennostt: boolean,
        public thutienstt: boolean,
        public idphieutiepnhan?: string,
        public tenkhachhang?: string,
        public dienthoai?: string,
        public diachia?: string,
        public idsuachua?: string,
        public tienno?: number,
        public idthutien?: string,
        public isdelete?: boolean
        /* public tenkhach?: string,
        public dienthoai?: string,
        public diachi?: string,
        public idhieuxe?: string,
        public idxesua?: string, */
    ) {}
}
