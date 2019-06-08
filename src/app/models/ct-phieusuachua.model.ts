import { Phutung } from './phutung.model';
import { Tiencong } from './tiencong.model';

export class CTPhieusuachua {
    constructor(
        public noidung: string,
        public phutung: Phutung,
        public soluong: number,
        public dongia: number,
        public tiencong: Tiencong,
        public thanhtien: number,
        public idctsuachua?: string,
    ) {}
}
