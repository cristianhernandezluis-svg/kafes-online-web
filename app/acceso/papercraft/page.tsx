export default function PapercraftAcceso() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden text-center">

        <div className="relative">
          <img
            src="https://i.postimg.cc/KY5PRqfq/Whats-App-Image-2026-06-29-at-12-19-52-PM.jpg"
            alt="Mega Kit Papercraft 3D Premium"
            className="w-full h-56 object-cover"
          />

          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-green-500 w-20 h-20 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            <span className="text-white text-4xl font-bold">✓</span>
          </div>
        </div>

        <div className="pt-14 px-6 pb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Felicidades!
          </h1>

          <p className="mt-4 text-gray-600 text-lg">
            Tu compra del <span className="font-bold text-indigo-600">Mega Kit Papercraft 3D Premium</span> fue aprobada exitosamente.
          </p>

          <div className="mt-8 bg-gray-100 rounded-2xl p-5 text-gray-600">
            Haz clic en el botón de abajo para ver tu material y empezar a crear.
          </div>

          <a
            href="PEGA_AQUI_TU_LINK_DE_DRIVE"
            target="_blank"
            className="mt-8 block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg transition"
          >
            📥 Abrir mi Mega Kit
          </a>

          <p className="mt-6 text-sm text-gray-500">
            Guarda este enlace para volver a ingresar cuando quieras.
          </p>
        </div>
      </div>
    </main>
  );
}