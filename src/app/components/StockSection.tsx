import { useState, useEffect } from 'react';
import { Package, Clock, AlertTriangle, DollarSign } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface StockSectionProps {
  language: 'en' | 'th';
}

interface StockItem {
  id: string;
  itemName: string;
  brand: string;
  loanAmount: string;
  dueDate: string;
  status: 'active' | 'reminder_1' | 'reminder_2' | 'reminder_3' | 'ready_to_sell';
  daysPastDue: number;
}

export function StockSection({ language }: StockSectionProps) {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);

  const t = {
    en: {
      title: 'Stock Management',
      subtitle: 'Monitor pawned items and redemption reminders',
      active: 'Active Loans',
      reminders: 'Reminder Sent',
      readyToSell: 'Ready to Sell',
      item: 'Item',
      loanAmount: 'Loan Amount',
      dueDate: 'Due Date',
      status: 'Status',
      daysPastDue: 'days past due',
      statusLabels: {
        active: 'Active',
        reminder_1: '1st Reminder',
        reminder_2: '2nd Reminder',
        reminder_3: '3rd Reminder',
        ready_to_sell: 'Ready to Sell',
      },
      reminderNote: '3 reminders sent before item marked ready to sell',
      readyToSellNote: 'Items overdue by 7+ days are ready to sell',
      noItems: 'No stock items yet',
    },
    th: {
      title: 'จัดการสต็อก',
      subtitle: 'ติดตามสินค้าจำนำและการแจ้งเตือนการไถ่คืน',
      active: 'กำลังจำนำ',
      reminders: 'ส่งการแจ้งเตือนแล้ว',
      readyToSell: 'พร้อมขาย',
      item: 'สินค้า',
      loanAmount: 'จำนวนกู้',
      dueDate: 'วันครบกำหนด',
      status: 'สถานะ',
      daysPastDue: 'วันเกินกำหนด',
      statusLabels: {
        active: 'กำลังจำนำ',
        reminder_1: 'แจ้งเตือนครั้งที่ 1',
        reminder_2: 'แจ้งเตือนครั้งที่ 2',
        reminder_3: 'แจ้งเตือนครั้งที่ 3',
        ready_to_sell: 'พร้อมขาย',
      },
      reminderNote: 'ส่งการแจ้งเตือน 3 ครั้งก่อนที่สินค้าจะพร้อมขาย',
      readyToSellNote: 'สินค้าที่เกินกำหนดมากกว่า 7 วันพร้อมขาย',
      noItems: 'ยังไม่มีสินค้าในสต็อก',
    },
  };

  useEffect(() => {
    loadStockItems();
  }, []);

  const loadStockItems = () => {
    // Load approved evaluations and simulate stock management
    const evaluations = JSON.parse(localStorage.getItem('evaluations') || '[]');
    const approvedItems = evaluations
      .filter((e: any) => e.status === 'approved' && e.staffDecision?.approved)
      .map((e: any) => {
        // Simulate due dates and reminder statuses
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 60) - 10); // Random date -10 to +50 days

        const today = new Date();
        const daysPastDue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

        let status: StockItem['status'] = 'active';
        if (daysPastDue > 7) {
          status = 'ready_to_sell';
        } else if (daysPastDue > 5) {
          status = 'reminder_3';
        } else if (daysPastDue > 3) {
          status = 'reminder_2';
        } else if (daysPastDue > 1) {
          status = 'reminder_1';
        }

        return {
          id: e.id,
          itemName: e.itemName,
          brand: e.brand,
          loanAmount: e.staffDecision.offerAmount,
          dueDate: dueDate.toISOString(),
          status,
          daysPastDue: Math.max(0, daysPastDue),
        };
      });

    setStockItems(approvedItems);
  };

  const getStatusColor = (status: StockItem['status']) => {
    switch (status) {
      case 'active':
        return 'bg-[#10B981] text-white';
      case 'reminder_1':
        return 'bg-blue-500 text-white';
      case 'reminder_2':
        return 'bg-[#F59E0B] text-white';
      case 'reminder_3':
        return 'bg-orange-500 text-white';
      case 'ready_to_sell':
        return 'bg-[#EF4444] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: StockItem['status']) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4" />;
      case 'reminder_1':
      case 'reminder_2':
      case 'reminder_3':
        return <AlertTriangle className="w-4 h-4" />;
      case 'ready_to_sell':
        return <DollarSign className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const activeItems = stockItems.filter((i) => i.status === 'active');
  const reminderItems = stockItems.filter((i) =>
    ['reminder_1', 'reminder_2', 'reminder_3'].includes(i.status)
  );
  const readyToSellItems = stockItems.filter((i) => i.status === 'ready_to_sell');

  return (
    <section id="stock" className="py-20 bg-[#F3F4F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Package className="w-16 h-16 text-[#F59E0B] mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-[#0A1F44] mb-4 font-['Montserrat']">
            {t[language].title}
          </h2>
          <p className="text-lg text-gray-600 font-['Inter']">{t[language].subtitle}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1 font-['Inter']">{t[language].active}</p>
                <p className="text-3xl font-bold text-[#10B981] font-['Montserrat']">{activeItems.length}</p>
              </div>
              <Clock className="w-12 h-12 text-[#10B981]" />
            </div>
          </Card>

          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1 font-['Inter']">{t[language].reminders}</p>
                <p className="text-3xl font-bold text-[#F59E0B] font-['Montserrat']">{reminderItems.length}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-[#F59E0B]" />
            </div>
          </Card>

          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1 font-['Inter']">{t[language].readyToSell}</p>
                <p className="text-3xl font-bold text-[#EF4444] font-['Montserrat']">{readyToSellItems.length}</p>
              </div>
              <DollarSign className="w-12 h-12 text-[#EF4444]" />
            </div>
          </Card>
        </div>

        {/* Stock Items Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {stockItems.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-['Inter']">{t[language].noItems}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0A1F44] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-['Montserrat']">{t[language].item}</th>
                    <th className="px-6 py-4 text-left font-['Montserrat']">{t[language].loanAmount}</th>
                    <th className="px-6 py-4 text-left font-['Montserrat']">{t[language].dueDate}</th>
                    <th className="px-6 py-4 text-left font-['Montserrat']">{t[language].status}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stockItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-[#0A1F44] font-['Montserrat']">
                            {item.brand} {item.itemName}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#10B981] font-bold font-['Inter']">
                          {item.loanAmount} ฿
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-700 font-['Inter']">
                            {new Date(item.dueDate).toLocaleDateString()}
                          </p>
                          {item.daysPastDue > 0 && (
                            <p className="text-xs text-red-500 font-['Inter']">
                              {item.daysPastDue} {t[language].daysPastDue}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`${getStatusColor(item.status)} flex items-center gap-1 w-fit font-['Inter']`}>
                          {getStatusIcon(item.status)}
                          {t[language].statusLabels[item.status]}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700 font-['Inter']">
              <AlertTriangle className="w-4 h-4 inline mr-2 text-blue-500" />
              {t[language].reminderNote}
            </p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-gray-700 font-['Inter']">
              <DollarSign className="w-4 h-4 inline mr-2 text-red-500" />
              {t[language].readyToSellNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
