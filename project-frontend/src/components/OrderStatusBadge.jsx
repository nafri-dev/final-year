/* eslint-disable react/prop-types */
const OrderStatusBadge = ({ status }) => {
    const getStatusBadgeClass = (status) => {
      switch (status) {
        case "pending":
          return "bg-yellow-100 text-yellow-800"
        case "processing":
          return "bg-blue-100 text-blue-800"
        case "shipped":
          return "bg-purple-100 text-purple-800"
        case "delivered":
          return "bg-green-100 text-green-800"
        case "cancelled":
          return "bg-red-100 text-red-800"
        default:
          return "bg-gray-100 text-gray-800"
      }
    }
  
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1)
  
    return (
      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusBadgeClass(status)}`}>
        {formattedStatus}
      </span>
    )
  }
  
  export default OrderStatusBadge
  
  