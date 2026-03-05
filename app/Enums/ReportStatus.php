<?php
// ReportStatus.php
namespace App\Enums;

enum ReportStatus: string
{
    case DICARI = 'dicari';
    case DITEMUKAN = 'ditemukan';
    case DITUTUP = 'ditutup';
}
