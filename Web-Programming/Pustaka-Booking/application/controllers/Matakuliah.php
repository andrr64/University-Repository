<?php

class Matakuliah extends CI_Controller
{
    public function index()
    {
        $this->load->helper('url');
        $this->load->library('form_validation');
        $this->load->view('view-form-matakuliah');
    }

    public function cetak()
    {
        $this->load->library('form_validation');
        $this->form_validation->set_rules('kode', 'Kode Matakuliah', 'required|min_length[3]', [
            'required' => 'Kode Matakuliah Harus diisi',
            'min_length' => 'Kode terlalu pendek'
        ]);
        $this->form_validation->set_rules('nama', 'Nama Matakuliah', 'required|min_length[3]', [
            'required' => 'Nama Matakuliah Harus diisi',
            'min_length' => 'Nama terlalu pendek'
        ]);
        $this->form_validation->set_rules('sks', 'SKS', 'required', [
            'required' => 'SKS Harus diisi'
        ]);
        // Jalankan validasi
        if ($this->form_validation->run() === FALSE) {
            // Jika validasi gagal, kembali ke halaman formulir dengan pesan kesalahan
            $this->load->view('view-form-matakuliah');
        } else {
            // Jika validasi berhasil, lanjutkan pemrosesan data
            $data = [
                'kode' => $this->input->post('kode'),
                'nama' => $this->input->post('nama'),
                'sks' => $this->input->post('sks')
            ];
            $this->load->helper('url');
            $this->load->view('view-data-matakuliah', $data);
        }
    }

}