<?php

namespace App\Enums;

enum ItemStatus: string
{
    case MENUNGGU_PENYERAHAN = 'MENUNGGU_PENYERAHAN';

    case DITITIPKAN = 'DITITIPKAN';

    case DIKLAIM = 'DIKLAIM';

    case SUDAH_DIKEMBALIKAN = 'SUDAH_DIKEMBALIKAN';

    case HILANG = 'HILANG';
}