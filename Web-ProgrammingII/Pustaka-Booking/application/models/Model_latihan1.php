<?php
class Model_latihan1 extends CI_Model
{
    public $nilai1, $nilai2, $hasil;
    public function jumlah($n1= null, $n2= null)
    {
        $this->nilai1 = $n1;
        $this->nilai2 = $n2;
        $this->hasil = $n1 + $n2;
        return $n1 + $n2;
    }
}