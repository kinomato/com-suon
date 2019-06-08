import { Phutung } from './phutung.model';

export class CTNhapphutung {
    constructor(
        public phutung: Phutung,
        public soluong: number,
        public dongia: number,
        public thanhtien: number,
        public idctnhappt?: string,
    ) {}
}