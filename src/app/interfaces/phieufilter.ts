import { Phieusuachua } from '../models/phieusuachua.model';
import { Phieutiepnhan } from '../models/phieutiepnhan.model';
import { Phieuthutien } from '../models/phieuthutien.model';
import { Nhapphutung } from '../models/nhapphutung.model';

export interface Phieufilter {
    phieu: Phieutiepnhan | Phieusuachua | Phieuthutien | Nhapphutung;
    idphieu: string;
    path: string;
    bienso: string;
    ngay?: {
        day: string;
        month: string;
        year: string;
    };
    type: Stage;
    tien?: number;
    collection?: string;
}

export interface Stage {
    tiepnhan?: boolean;
    suachua?: boolean;
    thutien?: boolean;
    phutung?: boolean;
    tiencong?: boolean;
    khachhang?: boolean;
    hieuxe?: boolean;
    /* nhappt?: boolean; */
}
