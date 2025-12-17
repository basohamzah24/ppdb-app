'use client';

import { useState } from 'react';

export default function InfoModal() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              ?? Informasi Lengkap PPDB SD
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              �
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-2xl p-6">
              <h4 className="text-xl font-semibold text-blue-800 mb-4">?? Persyaratan Pendaftaran</h4>
              <ul className="space-y-2 text-blue-700">
                <li>� Usia minimal 6 tahun pada 1 Juli 2025</li>
                <li>� Fotokopi akta kelahiran</li>
                <li>� Fotokopi kartu keluarga</li>
                <li>� Pas foto berwarna 3x4 (2 lembar)</li>
                <li>� Surat keterangan sehat dari dokter</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-2xl p-6">
              <h4 className="text-xl font-semibold text-green-800 mb-4">?? Jalur Pendaftaran</h4>
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-4">
                  <h5 className="font-semibold text-green-700">Zonasi (60%)</h5>
                  <p className="text-green-600 text-sm">Berdasarkan jarak tempat tinggal ke sekolah</p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <h5 className="font-semibold text-green-700">Prestasi (25%)</h5>
                  <p className="text-green-600 text-sm">Berdasarkan prestasi akademik dan non-akademik</p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <h5 className="font-semibold text-green-700">Afirmasi (15%)</h5>
                  <p className="text-green-600 text-sm">Untuk keluarga kurang mampu dengan surat keterangan</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6">
              <h4 className="text-xl font-semibold text-purple-800 mb-4">?? Biaya Pendidikan</h4>
              <div className="bg-white rounded-xl p-4">
                <p className="text-purple-700 font-semibold">GRATIS!</p>
                <p className="text-purple-600 text-sm">Tidak ada biaya pendaftaran atau SPP</p>
                <p className="text-purple-600 text-sm">Sesuai program pendidikan gratis pemerintah</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsOpen(false)}
              className="bg-linear-to-r from-blue-500 to-blue-600 text-white py-3 px-8 rounded-full font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function useInfoModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const Modal = () => {
    if (!isOpen) return null;

    return (
      <InfoModal />
    );
  };

  return { openModal, closeModal, Modal: () => Modal(), isOpen };
}

