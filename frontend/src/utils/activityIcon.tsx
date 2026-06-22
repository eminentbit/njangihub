import {
  FaUserPlus,
  FaUserMinus,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaGavel,
  FaCoins,
  FaPiggyBank,
  FaHandHoldingUsd,
  FaUsersCog,
} from "react-icons/fa";

const getActivityIcon = (type: string) => {
  switch (type) {
    case "MEMBER_JOIN":
      return <FaUserPlus className="text-green-500" />;
    case "MEMBER_LEAVE":
      return <FaUserMinus className="text-red-500" />;
    case "CONTRIBUTION_MADE":
      return <FaMoneyBillWave className="text-blue-500" />;
    case "NJANGI_CREATION_SUCCESS":
    case "NJANGI_CREATED":
      return <FaUsersCog className="text-green-600" />;
    case "NJANGI_CREATION_FAILURE":
      return <FaTimesCircle className="text-red-600" />;
    case "LOAN_REQUEST":
      return <FaFileInvoiceDollar className="text-yellow-500" />;
    case "LOAN_APPROVAL":
      return <FaCheckCircle className="text-green-500" />;
    case "LOAN_REJECTION":
      return <FaTimesCircle className="text-red-500" />;
    case "LOAN_REPAYMENT":
      return <FaPiggyBank className="text-purple-500" />;
    case "MEETING_SCHEDULED":
      return <FaCalendarAlt className="text-indigo-500" />;
    case "FINE_ISSUED":
      return <FaGavel className="text-red-600" />;
    case "FINE_PAYMENT":
      return <FaCoins className="text-green-500" />;
    case "BENEFICIARY_PAYOUT":
      return <FaHandHoldingUsd className="text-orange-500" />;
    default:
      return <FaCheckCircle className="text-gray-400" />;
  }
};

export default getActivityIcon;
