/**
 * nexCommerce AI &mdash; Intelligent Delivery Guidance (Feature 5)
 * 
 * Simulates the backend Logistics Service and the frontend Delivery Intelligence AI.
 * Converts raw operational logistics states into customer-facing natural language.
 */

class DeliveryIntelligenceEngine {
  constructor() {
    this.isAiAvailable = true; // Can be toggled for fallback testing
  }

  /**
   * Generates intelligent delivery guidance based on raw logistics data.
   * @param {Object} logisticsData - The authoritative shipment payload
   * @returns {Object} { headline, explanation, confidence, needsAction, isAiGenerated }
   */
  generateGuidance(logisticsData) {
    // 1. If AI is unavailable, use deterministic fallback
    if (!this.isAiAvailable || logisticsData.scenario === 'ai_failure') {
      return this._generateDeterministicFallback(logisticsData);
    }

    // 2. Parse authoritative data
    const status = logisticsData.status; // e.g. IN_TRANSIT, DELAYED
    const carrierReason = logisticsData.carrierReason || null;
    const isPartial = logisticsData.isPartial || false;
    
    // AI output structure
    let headline = '';
    let explanation = '';
    let confidence = 'high';
    let needsAction = false;
    
    // Evaluate Status
    switch(status) {
      case 'ORDER_CONFIRMED':
        headline = 'Your order is confirmed';
        explanation = 'We have received your order and it will be processed shortly.';
        break;
        
      case 'PREPARING':
        headline = 'We are preparing your order';
        explanation = 'Your items are currently being gathered and packed at our fulfillment center.';
        break;
        
      case 'SHIPPED':
      case 'IN_TRANSIT':
      case 'NEARING_DESTINATION':
        headline = 'Your order is on the way';
        explanation = 'Your package has left our fulfillment center and is currently in transit.';
        
        if (status === 'NEARING_DESTINATION') {
          explanation = 'Your package has reached the local delivery facility and is preparing for final dispatch.';
        }
        
        if (isPartial) {
          headline = 'Part of your order is on the way';
          explanation = 'Some items from your order are in transit. The remaining items will ship separately.';
        }
        break;
        
      case 'OUT_FOR_DELIVERY':
        headline = 'Your order is out for delivery';
        explanation = 'Your package is with the delivery partner and is expected to arrive today.';
        break;
        
      case 'DELIVERED':
        headline = 'Your order has been delivered';
        explanation = `Your package was marked as delivered today at ${logisticsData.lastUpdateTime || '3:42 PM'}.`;
        if (logisticsData.deliveryLocation) {
          explanation += ` Delivered to: ${logisticsData.deliveryLocation}.`;
        }
        break;
        
      case 'DELAYED':
        headline = 'Your delivery is taking longer than expected';
        confidence = 'medium';
        if (carrierReason) {
          explanation = `The latest carrier update indicates a delay due to ${carrierReason}. Your order is still in transit and we have updated your estimated delivery date.`;
        } else {
          explanation = 'Your order is taking longer than expected. We don\'t have a confirmed reason from the carrier yet, but your package is still on its way.';
        }
        break;
        
      case 'EXCEPTION':
        headline = 'There\'s an issue with your delivery';
        confidence = 'low';
        if (carrierReason) {
          explanation = `The carrier reported a delivery exception: ${carrierReason}. Please review the latest tracking details.`;
        } else {
          explanation = 'The carrier reported a delivery exception. We are investigating the issue with the delivery partner.';
        }
        break;
        
      case 'FAILED_ATTEMPT':
        headline = 'Delivery attempt unsuccessful';
        explanation = 'Our delivery partner attempted to deliver your order but couldn\'t complete the delivery. Another delivery attempt is expected on the next business day.';
        break;
        
      case 'ACTION_REQUIRED':
        headline = 'Action required for delivery';
        explanation = 'Please confirm your delivery address or contact details to help us complete the delivery.';
        needsAction = true;
        break;
        
      case 'RETURNED':
        headline = 'Your package is being returned';
        explanation = 'The latest carrier update shows that the package is being returned to the sender.';
        needsAction = true;
        break;
        
      case 'CANCELLED':
        headline = 'This order has been cancelled';
        explanation = 'This order was cancelled and will not be delivered.';
        break;
        
      default:
        headline = 'Tracking your order';
        explanation = 'Your order is moving through the delivery network.';
    }
    
    // Handle Stale Data
    if (logisticsData.dataAge === 'stale' && status !== 'DELIVERED' && status !== 'CANCELLED') {
      headline = 'Tracking information hasn\'t been updated recently';
      explanation = 'The latest carrier update was over 24 hours ago. We\'ll show a new update when one becomes available.';
      confidence = 'low';
    }

    return {
      headline,
      explanation,
      confidence,
      needsAction,
      isAiGenerated: true
    };
  }

  /**
   * Deterministic fallback when AI is unavailable.
   */
  _generateDeterministicFallback(logisticsData) {
    const statusMap = {
      'ORDER_CONFIRMED': 'Order confirmed.',
      'PREPARING': 'Preparing order.',
      'IN_TRANSIT': 'In transit.',
      'OUT_FOR_DELIVERY': 'Out for delivery.',
      'DELIVERED': 'Delivered.',
      'DELAYED': 'Delayed.',
      'ACTION_REQUIRED': 'Action required.',
      'CANCELLED': 'Cancelled.'
    };
    
    return {
      headline: statusMap[logisticsData.status] || 'Tracking update',
      explanation: 'Please check the timeline for current status.',
      confidence: 'low',
      needsAction: logisticsData.status === 'ACTION_REQUIRED',
      isAiGenerated: false
    };
  }

  /**
   * Conversational AI endpoint for answering natural language tracking questions.
   * Strictly grounded in authoritative data.
   */
  answerQuestion(question, logisticsData) {
    const q = question.toLowerCase();
    
    if (q.includes('when') || q.includes('time') || q.includes('expect')) {
      if (logisticsData.status === 'DELIVERED') return 'Your order has already been delivered.';
      if (logisticsData.status === 'CANCELLED') return 'This order is cancelled and will not be delivered.';
      if (logisticsData.expectedDate) {
        let confText = 'is currently expected';
        if (logisticsData.status === 'DELAYED') confText = 'has been updated and is now expected';
        return `Based on the latest tracking information, your order ${confText} on ${logisticsData.expectedDate}. The carrier last updated the shipment at ${logisticsData.lastUpdateTime}.`;
      }
      return 'I don\'t have a confirmed delivery date from the carrier right now. Please check back later.';
    }
    
    if (q.includes('where') || q.includes('location')) {
      if (logisticsData.status === 'DELIVERED') return `Your order was delivered to ${logisticsData.deliveryLocation || 'your address'}.`;
      if (logisticsData.status === 'PREPARING') return 'Your order is currently at our fulfillment center.';
      return 'Your package is currently in transit with our delivery partner.';
    }
    
    if (q.includes('why') && q.includes('delay')) {
      if (logisticsData.status === 'DELAYED') {
        if (logisticsData.carrierReason) {
          return `The carrier reported a delay due to: ${logisticsData.carrierReason}.`;
        }
        return 'We know your order is taking longer than expected, but we don\'t have a confirmed reason from the carrier yet.';
      }
      return 'Your order does not currently have any active delays on record.';
    }
    
    if (q.includes('address') || q.includes('change')) {
      if (logisticsData.status === 'PREPARING' || logisticsData.status === 'ORDER_CONFIRMED') {
        return 'Your order is still eligible for an address change. Please contact support immediately to update it before it ships.';
      }
      return 'Once an order has shipped, delivery address changes cannot be made directly. Please contact support for assistance.';
    }
    
    // Fallback for unsupported/unauthorized questions (Prompt Injection Protection)
    return 'I don\'t have enough tracking information to answer that. For complex requests, please contact our support team.';
  }
}

window.DeliveryAssistant = new DeliveryIntelligenceEngine();
