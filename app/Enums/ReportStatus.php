<?php

namespace App\Enums;

enum ReportStatus: string
{
    case AKTIF = 'aktif';
    case SELESAI = 'selesai';
    case DITUTUP = 'ditutup';
}
