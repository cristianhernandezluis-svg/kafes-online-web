const fs = require("fs");

const archivo = "app/admin/pedidos/[id]/page.tsx";

let contenido = fs.readFileSync(archivo, "utf8");

const inicioTexto = '          <aside className="space-y-6">';
const finTexto = "          </aside>";

const inicio = contenido.indexOf(inicioTexto);
const fin = contenido.indexOf(finTexto, inicio);

if (inicio === -1) {
  throw new Error("No se encontró el inicio del aside derecho.");
}

if (fin === -1) {
  throw new Error("No se encontró el cierre del aside derecho.");
}

const nuevoAside = `          <aside className="space-y-4">

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-bold text-slate-950">
                Acciones rápidas
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Actualiza el estado operativo del pedido.
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <form action={cambiarEstadoPedido}>
                  <input
                    type="hidden"
                    name="pedidoId"
                    value={pedido.id}
                  />

                  <input
                    type="hidden"
                    name="nuevoEstado"
                    value="CONFIRMADO"
                  />

                  <button
                    type="submit"
                    disabled={pedido.estado === "CONFIRMADO"}
                    className="w-full rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Confirmar
                  </button>
                </form>

                <form action={cambiarEstadoPedido}>
                  <input
                    type="hidden"
                    name="pedidoId"
                    value={pedido.id}
                  />

                  <input
                    type="hidden"
                    name="nuevoEstado"
                    value="PREPARANDO"
                  />

                  <button
                    type="submit"
                    disabled={pedido.estado === "PREPARANDO"}
                    className="w-full rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Preparando
                  </button>
                </form>

                <form action={cambiarEstadoPedido}>
                  <input
                    type="hidden"
                    name="pedidoId"
                    value={pedido.id}
                  />

                  <input
                    type="hidden"
                    name="nuevoEstado"
                    value="ENVIADO"
                  />

                  <button
                    type="submit"
                    disabled={pedido.estado === "ENVIADO"}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Enviado
                  </button>
                </form>

                <form action={cambiarEstadoPedido}>
                  <input
                    type="hidden"
                    name="pedidoId"
                    value={pedido.id}
                  />

                  <input
                    type="hidden"
                    name="nuevoEstado"
                    value="ENTREGADO"
                  />

                  <button
                    type="submit"
                    disabled={pedido.estado === "ENTREGADO"}
                    className="w-full rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Entregado
                  </button>
                </form>

                <form
                  action={cambiarEstadoPedido}
                  className="col-span-2"
                >
                  <input
                    type="hidden"
                    name="pedidoId"
                    value={pedido.id}
                  />

                  <input
                    type="hidden"
                    name="nuevoEstado"
                    value="CANCELADO"
                  />

                  <button
                    type="submit"
                    disabled={pedido.estado === "CANCELADO"}
                    className="w-full rounded-lg border border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Cancelar pedido
                  </button>
                </form>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-bold text-slate-950">
                Estado del pedido
              </h2>

              <div className="mt-3 divide-y divide-slate-100">
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-slate-600">
                    Pedido
                  </span>

                  <span
                    className={
                      "rounded-full px-3 py-1 text-xs font-bold " +
                      claseEstado(pedido.estado)
                    }
                  >
                    {textoEstado(pedido.estado)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-slate-600">
                    Pago
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    {textoEstado(pedido.estadoPago)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-slate-600">
                    Envío
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    {textoEstado(pedido.estadoEnvio)}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-950">
                <User size={18} />
                Cliente
              </h2>

              <div className="mt-3 space-y-2">
                <p className="font-bold text-slate-950">
                  {pedido.nombreCliente}
                </p>

                {pedido.emailCliente && (
                  <p className="text-sm text-slate-500">
                    {pedido.emailCliente}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Phone
                    size={16}
                    className="text-slate-400"
                  />

                  <span>{pedido.telefonoCliente}</span>
                </div>

                <a
                  href={
                    "https://wa.me/51" +
                    pedido.telefonoCliente.replace(/\\D/g, "")
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex text-sm font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Abrir WhatsApp
                </a>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-950">
                <MapPin size={18} />
                Dirección de entrega
              </h2>

              <div className="mt-3 space-y-1 text-sm leading-6 text-slate-700">
                <p>{pedido.direccion}</p>

                <p>
                  {pedido.ciudad}
                  {pedido.region ? ", " + pedido.region : ""}
                </p>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-bold text-slate-950">
                Pago
              </h2>

              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Tipo de pedido
                  </span>

                  <span className="text-right font-bold text-slate-900">
                    {textoTipoPedido(pedido.tipoPedido)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Método
                  </span>

                  <span className="text-right font-bold text-slate-900">
                    {textoMetodoPago(pedido.metodoPago)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Estado
                  </span>

                  <span className="font-bold text-slate-900">
                    {textoEstado(pedido.estadoPago)}
                  </span>
                </div>

                <div className="mt-3 space-y-2 border-t border-slate-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">
                      Total
                    </span>

                    <span className="font-black text-slate-950">
                      {formatoMoneda(Number(pedido.total))}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">
                      Adelanto
                    </span>

                    <span className="font-bold text-slate-900">
                      {formatoMoneda(Number(pedido.montoAdelanto))}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">
                      Saldo pendiente
                    </span>

                    <span className="font-black text-slate-950">
                      {formatoMoneda(Number(pedido.montoPendiente))}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {(pedido.observaciones || pedido.notasInternas) && (
              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-base font-bold text-slate-950">
                  Notas
                </h2>

                {pedido.observaciones && (
                  <div className="mt-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Cliente
                    </p>

                    <p className="mt-1.5 text-sm leading-6 text-slate-700">
                      {pedido.observaciones}
                    </p>
                  </div>
                )}

                {pedido.notasInternas && (
                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Internas
                    </p>

                    <p className="mt-1.5 text-sm leading-6 text-slate-700">
                      {pedido.notasInternas}
                    </p>
                  </div>
                )}
              </section>
            )}

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-bold text-slate-700">
                Origen del pedido
              </h2>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Fuente
                  </span>

                  <span className="text-right font-semibold text-slate-700">
                    {pedido.utmSource || "Directo / Sin atribución"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Medio
                  </span>

                  <span className="text-right font-semibold text-slate-700">
                    {pedido.utmMedium || "-"}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-slate-500">
                    Campaña
                  </span>

                  <span className="max-w-[65%] break-all text-right font-semibold text-slate-700">
                    {pedido.utmCampaign || "-"}
                  </span>
                </div>

                {pedido.utmContent && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500">
                      Contenido
                    </span>

                    <span className="max-w-[65%] break-all text-right text-slate-600">
                      {pedido.utmContent}
                    </span>
                  </div>
                )}

                {pedido.utmTerm && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500">
                      Término
                    </span>

                    <span className="max-w-[65%] break-all text-right text-slate-600">
                      {pedido.utmTerm}
                    </span>
                  </div>
                )}

                {pedido.landingPath && (
                  <div className="border-t border-slate-100 pt-2">
                    <p className="text-slate-400">
                      Página de entrada
                    </p>

                    <p className="mt-1 break-all text-slate-500">
                      {pedido.landingPath}
                    </p>
                  </div>
                )}
              </div>
            </section>

          </aside>`;

const actualizado =
  contenido.slice(0, inicio) +
  nuevoAside +
  contenido.slice(fin + finTexto.length);

fs.writeFileSync(archivo, actualizado, "utf8");

console.log("Lateral derecho reorganizado correctamente.");