import { notFound } from "next/navigation"
import { getOrderById, orderStatusLabels } from "@/lib/data/orders"
import { auth } from "@/auth"
import { PrintButton } from "@/components/orders/PrintButton"
import type { ShippingAddress } from "@/lib/validations/order"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ReceiptPage({ params }: PageProps) {
  const { id } = await params
  const session = await auth()
  const order = await getOrderById(id)

  if (!order) notFound()
  if (session?.user?.id && order.userId !== session.user.id) notFound()

  const address = order.shippingAddress as ShippingAddress
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <style>{`
        .receipt-paper {
          position: relative;
          overflow: hidden;
          background: #fbf7ec;
          color: #26221b;
          border: 1px solid #e2d9c3;
          border-inline-start: 8px solid #d9a441;
          border-radius: 6px;
          box-shadow: 0 24px 64px rgb(0 0 0 / 0.45), 0 2px 8px rgb(0 0 0 / 0.3);
          padding: 56px 56px 40px;
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        .receipt-paper::before {
          content: "ن";
          position: absolute;
          inset-inline-end: -40px;
          bottom: -90px;
          font-size: 320px;
          line-height: 1;
          color: #26221b;
          opacity: 0.04;
          pointer-events: none;
        }
        .rp-muted { color: #7a715d; }
        .rp-rule { border-color: #d9d0b8; }
        .rp-double { border-bottom: 3px double #26221b; }
        .rp-ornament { letter-spacing: 12px; color: #b4552d; }
        .rp-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
        .leader { display: flex; align-items: baseline; gap: 10px; }
        .leader .dots { flex: 1; border-bottom: 2px dotted #c9bfa4; transform: translateY(-4px); }
        .seal {
          position: absolute;
          inset-inline-end: 56px;
          top: 330px;
          width: 132px;
          height: 132px;
          border: 3px double #b4552d;
          border-radius: 50%;
          color: #b4552d;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          transform: rotate(-10deg);
          opacity: 0.9;
          text-align: center;
          pointer-events: none;
        }
        .seal::before {
          content: "";
          position: absolute;
          inset: 7px;
          border: 1px dashed #b4552d;
          border-radius: 50%;
        }
        .tear { border-top: 2px dashed #c9bfa4; position: relative; }
        .tear .scissors {
          position: absolute;
          top: -11px;
          inset-inline-start: 0;
          background: #fbf7ec;
          padding-inline-end: 10px;
          color: #7a715d;
          font-size: 14px;
        }
        .barcode {
          height: 46px;
          background: repeating-linear-gradient(
            90deg,
            #26221b 0 2px, transparent 2px 4px,
            #26221b 4px 7px, transparent 7px 9px,
            #26221b 9px 10px, transparent 10px 14px,
            #26221b 14px 16px, transparent 16px 19px
          );
        }
        @media (max-width: 640px) {
          .seal { display: none; }
          .receipt-paper { padding: 32px 24px; }
        }
        @media print {
          .no-print { display: none !important; }
          body > header, body > footer { display: none !important; }
          .receipt-paper {
            box-shadow: none;
            border-radius: 0;
            border: none;
            border-inline-start: 8px solid #d9a441;
            padding: 24px 8px;
          }
        }
      `}</style>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <PrintButton />

        <article className="receipt-paper">
          <header className="rp-double flex items-start justify-between pb-5">
            <div>
              <h1 className="font-display text-4xl">نونگاران</h1>
              <p className="rp-muted mt-2 text-xs">ناشر و فروشگاه کتاب فارسی</p>
            </div>
            <div className="text-left">
              <p className="rp-muted text-[11px]">رسید سفارش</p>
              <p className="rp-mono text-lg">{order.id.slice(0, 8)}</p>
              <p className="rp-muted rp-mono mt-1 text-[11px]">
                {new Date(order.createdAt).toLocaleDateString("fa-IR")}
              </p>
            </div>
          </header>

          <p className="rp-ornament mt-6 text-center text-sm">✦ ❖ ✦</p>
          <h2 className="mt-2 text-center font-display text-2xl">رسید سفارش کتاب</h2>

          <div className="mt-8 grid grid-cols-2 gap-10">
            <section>
              <h3 className="rp-muted text-xs">تحویل‌گیرنده</h3>
              <p className="mt-2 font-medium">{address.recipientName}</p>
              <p className="rp-mono mt-1 text-sm">{address.phone}</p>
              <p className="rp-muted mt-3 text-sm leading-6">
                {address.province}، {address.city}
                <br />
                {address.addressLine}
                <br />
                کد پستی: {address.postalCode}
              </p>
            </section>

            <section>
              <h3 className="rp-muted text-xs">خلاصه پرداخت</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div className="leader">
                  <span>اقلام</span>
                  <span className="dots" />
                  <span className="rp-mono">{itemCount.toLocaleString("fa-IR")}</span>
                </div>
                <div className="leader">
                  <span>هزینه ارسال</span>
                  <span className="dots" />
                  <span className="rp-muted">رایگان</span>
                </div>
                <div className="leader">
                  <span>وضعیت</span>
                  <span className="dots" />
                  <span>{orderStatusLabels[order.status]}</span>
                </div>
              </div>
            </section>
          </div>

          <section className="mt-10">
            <table className="w-full text-sm">
              <thead>
                <tr className="rp-rule border-y text-right">
                  <th className="py-2 font-medium">عنوان کتاب</th>
                  <th className="py-2 text-center font-medium">تعداد</th>
                  <th className="py-2 text-left font-medium">قیمت واحد</th>
                  <th className="py-2 text-left font-medium">جمع</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="rp-rule border-b">
                    <td className="py-3">{item.book.title}</td>
                    <td className="rp-mono py-3 text-center">{item.quantity.toLocaleString("fa-IR")}</td>
                    <td className="rp-mono py-3 text-left">{item.unitPrice.toLocaleString("fa-IR")}</td>
                    <td className="rp-mono py-3 text-left">{item.subtotal.toLocaleString("fa-IR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="leader mt-6 text-base">
              <span className="font-medium">جمع کل قابل پرداخت</span>
              <span className="dots" />
              <span className="rp-mono font-display text-2xl">
                {order.totalAmount.toLocaleString("fa-IR")} تومان
              </span>
            </div>
          </section>

          <div className="seal">
            <span className="text-[10px]">نشر نونگاران</span>
            <span className="text-[11px] font-medium">{orderStatusLabels[order.status]}</span>
            <span className="rp-mono text-[9px]">{order.id.slice(0, 4)}</span>
          </div>

          <footer className="tear mt-14 pt-5">
            <span className="scissors">✂</span>
            <div className="flex items-end justify-between gap-6">
              <p className="rp-muted max-w-[34ch] text-[11px] leading-5">
                این رسید بدون امضا معتبر است. شماره سفارش را برای پیگیری نزد خود نگه دارید.
              </p>
              <div className="text-left">
                <div className="barcode w-40" />
                <p className="rp-muted rp-mono mt-1 text-[10px]">{order.id}</p>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </>
  )
}