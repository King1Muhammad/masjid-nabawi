import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, Send, UserPlus, FileText } from 'lucide-react';

interface FlatProps {
  blockName: string;
  flatNumber: number;
  status: 'paid' | 'pending' | 'vacant';
  amount?: number;
  paymentDate?: string;
  onClick?: () => void;
}

const FlatDisplay: React.FC<FlatProps> = ({
  blockName,
  flatNumber,
  status,
  amount = 1500,
  paymentDate,
  onClick
}) => {
  const flatId = `${blockName}-${flatNumber}`;
  
  const colorClass = 
    status === 'paid' ? 'bg-green-100 border-green-500 text-green-700' :
    status === 'pending' ? 'bg-red-100 border-red-500 text-red-700' :
    'bg-gray-100 border-black text-gray-700';
  
  const statusIcon = 
    status === 'paid' ? <CheckCircle className="h-5 w-5 text-green-500" /> :
    status === 'pending' ? <XCircle className="h-5 w-5 text-red-500" /> :
    <AlertCircle className="h-5 w-5 text-gray-900" />;
  
  return (
    <div 
      className={`border-2 rounded-lg p-3 md:p-4 ${colorClass} hover:shadow-md transition-shadow text-center md:text-left`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-base md:text-lg">{flatId}</h4>
        {statusIcon}
      </div>
      
      <div className="text-xs md:text-sm space-y-1">
        <div className="flex justify-between">
          <span>Status:</span>
          <span className="font-medium capitalize">{status}</span>
        </div>
        {status !== 'vacant' && (
          <>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span>PKR {amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{status === 'paid' && paymentDate ? paymentDate : 'Pending'}</span>
            </div>
          </>
        )}
      </div>
      
      <div className="mt-2 md:mt-3 pt-2 border-t border-current/30 flex justify-between items-center">
        {status === 'pending' ? (
          <Button variant="outline" size="sm" className="w-full text-xs py-1" onClick={onClick}>
            <Send className="h-3 w-3 mr-1" />
            Pay Now
          </Button>
        ) : status === 'vacant' ? (
          <Button variant="outline" size="sm" className="w-full text-xs py-1" onClick={onClick}>
            <UserPlus className="h-3 w-3 mr-1" />
            Register
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="w-full text-xs py-1" onClick={onClick}>
            <FileText className="h-3 w-3 mr-1" />
            Receipt
          </Button>
        )}
      </div>
    </div>
  );
};

export default FlatDisplay;