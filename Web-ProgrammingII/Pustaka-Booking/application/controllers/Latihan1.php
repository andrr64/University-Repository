<?php
class Latihan1 extends CI_Controller
{
    public function index()
    {
    }

    public function sum($n1, $n2)
    {
        // Hanya menggunakan model
        // echo "<h1>Selamat datang </h1>  ";
        // $this->load->model('Model_latihan1');
        // $hasil = $this->Model_latihan1->jumlah($n1, $n2);
        // echo "Hasil penjumlahan dari ". $n1 . " + ". $n2 . " = " . $hasil;
    
        // Menggunakan model dan view
        $this->load->model('Model_latihan1');
        $data['nilai1'] = $n1;
        $data['nilai2'] = $n2;
        $data['hasil'] = $this->Model_latihan1->jumlah($n1, $n2);
        $this->load->view('view-latihan1', $data);
    }
}