<?php
function cek_login()
{
    $ci = get_instance();
    if (!$ci->session->userdata('email')) {
        $ci->session->set_flashdata('pesan', '<div class="alert alert-danger" role="alert">Akses ditolak. Anda belum login!!</div>');
        redirect('autentifikasi');
    } else {
        $role_id = $ci->session->userdata('role_id');
        // Jika ada logika tambahan berdasarkan role_id, bisa ditambahkan di sini
        // Misalnya, jika hanya admin yang boleh mengakses halaman ini:
        // if ($role_id != 'admin') {
        //     redirect('halaman_tertentu');
        // }
    }
}
