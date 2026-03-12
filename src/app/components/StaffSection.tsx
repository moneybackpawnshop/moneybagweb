import { useState, useEffect } from 'react';
import { UserCog, CheckCircle, XCircle, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { toast } from 'sonner';

interface StaffSectionProps {
  language: 'en' | 'th';
}

interface Evaluation {
  id: string;
  category: string;
  brand: string;
  itemName: string;
  requestAmount: string;
  status: string;
  createdAt: string;
  staffDecision?: {
    approved: boolean;
    offerAmount?: string;
    decidedAt: string;
  };
}

export function StaffSection({ language }: StaffSectionProps) {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [offerAmount, setOfferAmount] = useState('');

  const t = {
    en: {
      title: 'Staff Decision Portal',
      subtitle: 'Review and approve loan applications',
      pending: 'Pending Evaluations',
      noEvaluations: 'No pending evaluations',
      category: 'Category',
      brand: 'Brand',
      item: 'Item',
      requested: 'Requested',
      createdAt: 'Submitted',
      review: 'Review',
      offerAmount: 'Offer Amount',
      approve: 'Approve Loan',
      reject: 'Reject Loan',
      approved: 'Approved',
      rejected: 'Rejected',
      decision: 'Decision',
      approvedMsg: 'Loan approved successfully! Notifications sent.',
      rejectedMsg: 'Loan rejected. Customer will be notified.',
      notificationNote: 'SMS/Email notifications will be sent to customer',
      contractNote: 'E-sign contract pending customer signature',
    },
    th: {
      title: 'ระบบพนักงาน',
      subtitle: 'พิจารณาและอนุมัติคำขอกู้',
      pending: 'รายการรอพิจารณา',
      noEvaluations: 'ไม่มีรายการรอพิจารณา',
      category: 'หมวดหมู่',
      brand: 'ยี่ห้อ',
      item: 'สินค้า',
      requested: 'จำนวนที่ขอ',
      createdAt: 'วันที่ส่ง',
      review: 'พิจารณา',
      offerAmount: 'จำนวนที่เสนอ',
      approve: 'อนุมัติ',
      reject: 'ปฏิเสธ',
      approved: 'อนุมัติแล้ว',
      rejected: 'ปฏิเสธแล้ว',
      decision: 'การตัดสินใจ',
      approvedMsg: 'อนุมัติคำขอกู้สำเร็จ! ส่งการแจ้งเตือนแล้ว',
      rejectedMsg: 'ปฏิเสธคำขอกู้ ลูกค้าจะได้รับการแจ้งเตือน',
      notificationNote: 'จะส่งการแจ้งเตือน SMS/Email ให้ลูกค้า',
      contractNote: 'สัญญา E-sign รอลูกค้าเซ็นต์',
    },
  };

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = () => {
    const stored = JSON.parse(localStorage.getItem('evaluations') || '[]');
    setEvaluations(stored);
  };

  const handleDecision = (approved: boolean) => {
    if (!selectedEvaluation) return;

    if (approved && !offerAmount) {
      toast.error(language === 'en' ? 'Please enter offer amount' : 'กรุณากรอกจำนวนเงินที่เสนอ');
      return;
    }

    const decision = {
      approved,
      offerAmount: approved ? offerAmount : undefined,
      decidedAt: new Date().toISOString(),
    };

    // Update evaluation with staff decision
    const updatedEvaluations = evaluations.map((evaluation) =>
      evaluation.id === selectedEvaluation.id
        ? { ...evaluation, status: approved ? 'approved' : 'rejected', staffDecision: decision }
        : evaluation
    );

    localStorage.setItem('evaluations', JSON.stringify(updatedEvaluations));
    setEvaluations(updatedEvaluations);

    // Simulate notification sending
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push({
      evaluationId: selectedEvaluation.id,
      type: 'staff_decision',
      approved,
      offerAmount: decision.offerAmount,
      sentAt: new Date().toISOString(),
      channels: ['sms', 'email'],
      contractStatus: approved ? 'pending_signature' : 'n/a',
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));

    toast.success(approved ? t[language].approvedMsg : t[language].rejectedMsg);

    setSelectedEvaluation(null);
    setOfferAmount('');
  };

  const pendingEvaluations = evaluations.filter((e) => e.status === 'pending');

  return (
    <section id="staff" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <UserCog className="w-16 h-16 text-[#10B981] mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-[#0A1F44] mb-4 font-['Montserrat']">
            {t[language].title}
          </h2>
          <p className="text-lg text-gray-600 font-['Inter']">{t[language].subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Pending Evaluations List */}
          <div>
            <h3 className="text-2xl font-bold text-[#0A1F44] mb-6 font-['Montserrat']">
              {t[language].pending}
            </h3>
            {pendingEvaluations.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500 font-['Inter']">{t[language].noEvaluations}</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {pendingEvaluations.map((evaluation) => (
                  <Card
                    key={evaluation.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedEvaluation?.id === evaluation.id
                        ? 'border-2 border-[#10B981] shadow-lg'
                        : 'border border-gray-200 hover:border-[#10B981]/50'
                    }`}
                    onClick={() => setSelectedEvaluation(evaluation)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-[#0A1F44] font-['Montserrat']">
                          {evaluation.brand} {evaluation.itemName}
                        </h4>
                        <p className="text-sm text-gray-500 font-['Inter']">{evaluation.category}</p>
                      </div>
                      <span className="text-[#10B981] font-bold font-['Inter']">
                        {evaluation.requestAmount} ฿
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-['Inter']">
                      {new Date(evaluation.createdAt).toLocaleDateString()}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Decision Panel */}
          <div>
            <h3 className="text-2xl font-bold text-[#0A1F44] mb-6 font-['Montserrat']">
              {t[language].decision}
            </h3>
            {selectedEvaluation ? (
              <div className="bg-[#F3F4F6] rounded-2xl shadow-xl p-8 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-['Inter']">{t[language].category}:</span>
                    <span className="font-bold text-[#0A1F44] font-['Inter']">
                      {selectedEvaluation.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-['Inter']">{t[language].brand}:</span>
                    <span className="font-bold text-[#0A1F44] font-['Inter']">
                      {selectedEvaluation.brand}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-['Inter']">{t[language].item}:</span>
                    <span className="font-bold text-[#0A1F44] font-['Inter']">
                      {selectedEvaluation.itemName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-['Inter']">{t[language].requested}:</span>
                    <span className="font-bold text-[#10B981] font-['Inter']">
                      {selectedEvaluation.requestAmount} ฿
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Label htmlFor="offerAmount">{t[language].offerAmount}</Label>
                  <Input
                    id="offerAmount"
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder="0"
                    className="mt-2 bg-white font-['Inter']"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => handleDecision(true)}
                    className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white py-6 font-['Inter']"
                  >
                    <CheckCircle className="mr-2 w-5 h-5" />
                    {t[language].approve}
                  </Button>
                  <Button
                    onClick={() => handleDecision(false)}
                    variant="destructive"
                    className="flex-1 py-6 font-['Inter']"
                  >
                    <XCircle className="mr-2 w-5 h-5" />
                    {t[language].reject}
                  </Button>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                    <Send className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 font-['Inter']">{t[language].notificationNote}</p>
                  </div>
                  <div className="flex items-start space-x-2 p-3 bg-amber-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 font-['Inter']">{t[language].contractNote}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-8 text-center h-full flex items-center justify-center">
                <p className="text-gray-500 font-['Inter']">
                  {language === 'en'
                    ? 'Select an evaluation to review'
                    : 'เลือกรายการที่ต้องการพิจารณา'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}