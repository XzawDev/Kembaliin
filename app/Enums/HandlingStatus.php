<?php
// HandlingStatus.php
namespace App\Enums;

enum HandlingStatus: string
{
    case MENUNGGU_PENYERAHAN = 'menunggu_penyerahan';
    case DITITIPKAN_PETUGAS = 'dititipkan_petugas';
    case DIKLAIM = 'diklaim';
    case DIKEMBALIKAN = 'dikembalikan';
}