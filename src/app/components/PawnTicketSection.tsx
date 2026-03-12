import { useState, useEffect } from 'react';
import { FileText, Calendar, DollarSign, Bell, Send, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';

interface PawnTicketSectionProps {
  language: 'en' | 'th';
}

interface PawnTicket {
  id: string;
  customerName: string;
  nationalId: string;
  itemDescription: string;
  loanAmount: number;
  interestRate: number;
  startDate: string;
  dueDate: string;
  status: 'active' | 'overdue' | 'completed';
  daysOverdue: number;
  totalAmount: number;
}

interface Notification {
  id: string;
  ticketId: string;
  type: 'line' | 'sms';
  daysBefore: number;
  sentAt: string;
  status: 'sent' | 'pending' | 'failed';
}

export function PawnTicketSection({ language }: PawnTicketSectionProps) {
  const [tickets, setTickets] = useState<PawnTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<PawnTicket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const t = {
    en: {
      title: 'Digital Pawn Ticket Management',
      subtitle: 'Manage pawn contracts with automated notifications',
      myTickets: 'My Pawn Tickets',
      ticketId: 'Ticket ID',
      customerName: 'Customer Name',
      nationalId: 'National ID',
      itemDescription: 'Item Description',
      loanAmount: 'Loan Amount',
      interestRate: 'Interest Rate',
      startDate: 'Start Date',
      dueDate: 'Due Date',
      totalAmount: 'Total Amount Due',
      status: 'Status',
      active: 'Active',
      overdue: 'Overdue',
      completed: 'Completed',
      daysOverdue: 'Days Overdue',
      viewDetails: 'View Details',
      notifications: 'Automated Notifications',
      notificationSchedule: 'Notification Schedule',
      day7: '7 days before due date',
      day3: '3 days before due date',
      day1: '1 day before due date',
      dayOverdue: 'Overdue notification',
      lineOA: 'LINE Official Account',
      sms: 'SMS',
      sent: 'Sent',
      pending: 'Pending',
      failed: 'Failed',
      sendTestNotification: 'Send Test Notification',
      notificationSent: 'Notification sent successfully via LINE OA',
      calculateInterest: 'Interest Calculation',
      interestNote: 'Interest calculated at max 15% per year as per regulations',
      principalAmount: 'Principal Amount',
      interestAmount: 'Interest Amount',
      total: 'Total',
      createTicket: 'Create New Ticket',
      noTickets: 'No pawn tickets found',
    },
    th: {
      title: 'ระบบตั๋วจำนำดิจิทัล',
      subtitle: 'จัดการสัญญาจำนำพร้อมการแจ้งเตือนอัตโนมัติ',
      myTickets: 'ตั๋วจำนำของฉัน',
      ticketId: 'เลขที่ตั๋ว',
      customerName: 'ชื่อลูกค้า',
      nationalId: 'เลขบัตรประชาชน',
      itemDescription: 'รายละเอียดสินค้า',
      loanAmount: 'ยอดเงินกู้',
      interestRate: 'อัตราดอกเบี้ย',
      startDate: 'วันที่เริ่ม',
      dueDate: 'วันครบกำหนด',
      totalAmount: 'ยอดรวมที่ต้องชำระ',
      status: 'สถานะ',
      active: 'ปกติ',
      overdue: 'เกินกำหนด',
      completed: 'เสร็จสิ้น',
      daysOverdue: 'เกินกำหนด',
      viewDetails: 'ดูรายละเอียด',
      notifications: 'การแจ้งเตือนอัตโนมัติ',
      notificationSchedule: 'กำหนดการแจ้งเตือน',
      day7: '7 วันก่อนครบกำหนด',
      day3: '3 วันก่อนครบกำหนด',
      day1: '1 วันก่อนครบกำหนด',
      dayOverdue: 'แจ้งเตือนเมื่อเกินกำหนด',
      lineOA: 'LINE Official Account',
      sms: 'SMS',
      sent: 'ส่งแล้ว',
      pending: 'รอส่ง',
      failed: 'ล้มเหลว',
      sendTestNotification: 'ส่งการแจ้งเตือนทดสอบ',
      notificationSent: 'ส่งการแจ้งเตือนผ่าน LINE OA สำเร็จ',
      calculateInterest: 'การคำนวณดอกเบี้ย',
      interestNote: 'คำนวณดอกเบี้ยไม่เกิน 15% ต่อปีตามกฎหมาย',
      principalAmount: 'เงินต้น',
      interestAmount: 'ดอกเบี้ย',
      total: 'รวม',
      createTicket: 'สร้างตั๋วใหม่',
      noTickets: 'ไม่พบตั๋วจำนำ',
    },
  };

  // Load mock pawn tickets
  useEffect(() => {
    const mockTickets: PawnTicket[] = [
      {
        id: 'PT-2026-0001',
        customerName: 'สมชาย ใจดี',
        nationalId: '1234567890123',
        itemDescription: 'สร้อยคอทองคำ 96.5% น้ำหนัก 2 บาท',
        loanAmount: 45000,
        interestRate: 15,
        startDate: '2026-03-01',
        dueDate: '2026-04-01',
        status: 'active',
        daysOverdue: 0,
        totalAmount: 45562.50,
      },
      {
        id: 'PT-2026-0002',
        customerName: 'สมหญิง รักษ์ดี',
        nationalId: '9876543210987',
        itemDescription: 'นาฬิกา Rolex Submariner',
        loanAmount: 150000,
        interestRate: 12,
        startDate: '2026-02-15',
        dueDate: '2026-03-15',
        status: 'active',
        daysOverdue: 0,
        totalAmount: 151500,
      },
    ];
    setTickets(mockTickets);

    // Load notifications
    const mockNotifications: Notification[] = [
      {
        id: 'N-001',
        ticketId: 'PT-2026-0001',
        type: 'line',
        daysBefore: 7,
        sentAt: '2026-03-25 10:00',
        status: 'pending',
      },
      {
        id: 'N-002',
        ticketId: 'PT-2026-0001',
        type: 'line',
        daysBefore: 3,
        sentAt: '',
        status: 'pending',
      },
      {
        id: 'N-003',
        ticketId: 'PT-2026-0001',
        type: 'sms',
        daysBefore: 1,
        sentAt: '',
        status: 'pending',
      },
    ];
    setNotifications(mockNotifications);
  }, []);

  const calculateInterest = (ticket: PawnTicket) => {
    const principal = ticket.loanAmount;
    const rate = ticket.interestRate / 100;
    const startDate = new Date(ticket.startDate);
    const dueDate = new Date(ticket.dueDate);
    const days = Math.floor((dueDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const interest = (principal * rate * days) / 365;
    return {
      principal,
      interest: Math.round(interest * 100) / 100,
      total: principal + Math.round(interest * 100) / 100,
    };
  };

  const sendTestNotification = (ticketId: string) => {
    // In production, this would call LINE Messaging API
    // POST https://api.line.me/v2/bot/message/push
    // Headers: { Authorization: 'Bearer YOUR_CHANNEL_ACCESS_TOKEN' }
    // Body: { to: 'USER_ID', messages: [{ type: 'text', text: 'Payment reminder...' }] }
    
    toast.success(t[language].notificationSent);
    
    // Update notification status
    setNotifications(prev => prev.map(n => 
      n.ticketId === ticketId && n.status === 'pending'
        ? { ...n, status: 'sent' as const, sentAt: new Date().toISOString() }
        : n
    ));
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-[#10B981] text-white',
      overdue: 'bg-red-500 text-white',
      completed: 'bg-gray-500 text-white',
    };
    return styles[status as keyof typeof styles] || styles.active;
  };

  return (
    <section id="pawn-tickets" className="py-20 bg-[#F3F4F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FileText className="w-16 h-16 text-[#10B981] mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-[#0A1F44] mb-4 font-['Montserrat']">
            {t[language].title}
          </h2>
          <p className="text-lg text-gray-600 font-['Inter']">{t[language].subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pawn Tickets List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#0A1F44] font-['Montserrat']">
                {t[language].myTickets}
              </h3>
              <Button className="bg-[#10B981] hover:bg-[#059669] font-['Inter']">
                {t[language].createTicket}
              </Button>
            </div>

            <div className="space-y-4">
              {tickets.length === 0 ? (
                <Alert>
                  <AlertDescription className="font-['Inter']">
                    {t[language].noTickets}
                  </AlertDescription>
                </Alert>
              ) : (
                tickets.map((ticket) => {
                  const interest = calculateInterest(ticket);
                  return (
                    <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-[#0A1F44] font-['Montserrat']">
                              {ticket.id}
                            </CardTitle>
                            <p className="text-sm text-gray-600 font-['Inter'] mt-1">
                              {ticket.customerName}
                            </p>
                          </div>
                          <Badge className={getStatusBadge(ticket.status)}>
                            {t[language][ticket.status]}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 font-['Inter']">{t[language].loanAmount}</p>
                            <p className="font-bold text-[#0A1F44] font-['Inter']">
                              {ticket.loanAmount.toLocaleString()} THB
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 font-['Inter']">{t[language].interestRate}</p>
                            <p className="font-bold text-[#0A1F44] font-['Inter']">
                              {ticket.interestRate}% {language === 'en' ? 'per year' : 'ต่อปี'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 font-['Inter']">{t[language].dueDate}</p>
                            <p className="font-bold text-[#0A1F44] font-['Inter']">
                              {new Date(ticket.dueDate).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US')}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 font-['Inter']">{t[language].totalAmount}</p>
                            <p className="font-bold text-[#F59E0B] font-['Inter']">
                              {interest.total.toLocaleString()} THB
                            </p>
                          </div>
                        </div>
                        <div className="border-t pt-3">
                          <p className="text-sm text-gray-600 font-['Inter']">
                            {ticket.itemDescription}
                          </p>
                        </div>
                        <Button
                          onClick={() => setSelectedTicket(ticket)}
                          variant="outline"
                          className="w-full font-['Inter']"
                        >
                          {t[language].viewDetails}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* Ticket Details and Notifications */}
          <div className="space-y-6">
            {selectedTicket && (
              <>
                {/* Interest Calculation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#0A1F44] font-['Montserrat'] flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      {t[language].calculateInterest}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert className="bg-[#F59E0B]/10 border-[#F59E0B]">
                      <AlertDescription className="text-sm font-['Inter']">
                        {t[language].interestNote}
                      </AlertDescription>
                    </Alert>
                    
                    {(() => {
                      const calc = calculateInterest(selectedTicket);
                      return (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-['Inter']">{t[language].principalAmount}:</span>
                            <span className="font-bold text-[#0A1F44] font-['Inter']">
                              {calc.principal.toLocaleString()} THB
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-['Inter']">
                              {t[language].interestAmount} ({selectedTicket.interestRate}%):
                            </span>
                            <span className="font-bold text-[#F59E0B] font-['Inter']">
                              {calc.interest.toLocaleString()} THB
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-3 border-t-2">
                            <span className="text-lg font-bold text-[#0A1F44] font-['Montserrat']">
                              {t[language].total}:
                            </span>
                            <span className="text-lg font-bold text-[#10B981] font-['Montserrat']">
                              {calc.total.toLocaleString()} THB
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>

                {/* Automated Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#0A1F44] font-['Montserrat'] flex items-center">
                      <Bell className="w-5 h-5 mr-2" />
                      {t[language].notifications}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert className="bg-[#10B981]/10 border-[#10B981]">
                      <AlertDescription className="font-['Inter']">
                        <div className="font-bold mb-2">{t[language].notificationSchedule}:</div>
                        <ul className="space-y-1 text-sm">
                          <li>• {t[language].day7}</li>
                          <li>• {t[language].day3}</li>
                          <li>• {t[language].day1}</li>
                          <li>• {t[language].dayOverdue}</li>
                        </ul>
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                      {notifications
                        .filter(n => n.ticketId === selectedTicket.id)
                        .map((notification) => (
                          <div
                            key={notification.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              {notification.type === 'line' ? (
                                <Send className="w-5 h-5 text-[#06C755]" />
                              ) : (
                                <Send className="w-5 h-5 text-[#10B981]" />
                              )}
                              <div>
                                <p className="font-bold text-[#0A1F44] text-sm font-['Inter']">
                                  {notification.daysBefore} {language === 'en' ? 'days before' : 'วันก่อน'}
                                </p>
                                <p className="text-xs text-gray-500 font-['Inter']">
                                  {t[language][notification.type]}
                                </p>
                              </div>
                            </div>
                            <Badge
                              className={
                                notification.status === 'sent'
                                  ? 'bg-[#10B981]'
                                  : notification.status === 'pending'
                                  ? 'bg-[#F59E0B]'
                                  : 'bg-red-500'
                              }
                            >
                              {t[language][notification.status]}
                            </Badge>
                          </div>
                        ))}
                    </div>

                    <Button
                      onClick={() => sendTestNotification(selectedTicket.id)}
                      className="w-full bg-[#06C755] hover:bg-[#05b34a] text-white font-['Inter']"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {t[language].sendTestNotification}
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {!selectedTicket && (
              <Alert>
                <AlertDescription className="text-center font-['Inter']">
                  {language === 'en'
                    ? 'Select a pawn ticket to view details and notifications'
                    : 'เลือกตั๋วจำนำเพื่อดูรายละเอียดและการแจ้งเตือน'}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
