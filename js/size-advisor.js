(function() {
  'use strict';

  var STORAGE_KEY = 'nexcommerce_measurements';

  var NexSizeAdvisor = {
    /**
     * Load saved body measurements from localStorage
     */
    loadMeasurements: function() {
      try {
        var data = localStorage.getItem(STORAGE_KEY);
        if (data) {
          return JSON.parse(data);
        }
      } catch (e) {
        console.error('Failed to load measurements', e);
      }
      return null;
    },

    /**
     * Save body measurements to localStorage
     * @param {Object} measurements e.g. { chest: 100, unit: 'cm' }
     */
    saveMeasurements: function(measurements) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(measurements));
        return true;
      } catch (e) {
        console.error('Failed to save measurements', e);
        return false;
      }
    },

    /**
     * Delete measurements from localStorage
     */
    deleteMeasurements: function() {
      localStorage.removeItem(STORAGE_KEY);
    },

    /**
     * Deterministically calculate the recommended size based on a measurement and a size chart.
     * @param {number} rawValue The measurement value
     * @param {string} unit 'cm' or 'inches'
     * @param {string} fitPreference 'Slim', 'Regular', 'Relaxed', 'Oversized'
     * @param {Object} sizeChart e.g. { S: { min: 88, max: 94 }, M: { min: 95, max: 101 }, L: { min: 102, max: 108 }, XL: { min: 109, max: 115 } }
     */
    calculateSize: function(rawValue, unit, fitPreference, sizeChart) {
      if (!rawValue || isNaN(rawValue) || rawValue <= 0) {
        return { error: 'Please enter a valid measurement greater than 0.' };
      }

      if (!sizeChart || Object.keys(sizeChart).length === 0) {
        return { error: 'Size recommendations aren\'t available for this product yet.' };
      }

      var normalizedValue = parseFloat(rawValue);
      // Normalize to cm for calculation if needed (assume charts are in cm for now)
      if (unit === 'inches') {
        normalizedValue = normalizedValue * 2.54;
      }

      var sizes = Object.keys(sizeChart); // Assume ordered smallest to largest, e.g., S, M, L, XL
      
      // 1. Find base size
      var baseSize = null;
      var baseIndex = -1;
      var isBorderlineUpper = false;
      var isBorderlineLower = false;
      
      for (var i = 0; i < sizes.length; i++) {
        var sz = sizes[i];
        var bounds = sizeChart[sz];
        
        // Match if within bounds
        if (normalizedValue >= bounds.min && normalizedValue <= bounds.max) {
          baseSize = sz;
          baseIndex = i;
          
          // Check if it's on the upper/lower boundary (within 1cm)
          if (normalizedValue >= bounds.max - 1) {
            isBorderlineUpper = true;
          }
          if (normalizedValue <= bounds.min + 1) {
            isBorderlineLower = true;
          }
          break;
        }
      }

      // Handle out of bounds
      if (!baseSize) {
        var firstBounds = sizeChart[sizes[0]];
        var lastBounds = sizeChart[sizes[sizes.length - 1]];
        if (normalizedValue < firstBounds.min) {
           // Below smallest
           baseSize = sizes[0];
           baseIndex = 0;
        } else if (normalizedValue > lastBounds.max) {
           // Above largest
           baseSize = sizes[sizes.length - 1];
           baseIndex = sizes.length - 1;
        }
      }

      var recommendedSize = baseSize;
      var recommendedIndex = baseIndex;
      var explanationPoints = [];
      
      explanationPoints.push('Your measurement matches a base size of ' + baseSize + '.');
      
      var prefLower = (fitPreference || 'Regular').toLowerCase();
      
      // 2. Apply Fit Preference logic
      if (prefLower === 'relaxed' || prefLower === 'oversized') {
        // If borderline upper, definitely size up. Otherwise, standard size up.
        if (recommendedIndex < sizes.length - 1) {
          recommendedIndex++;
          recommendedSize = sizes[recommendedIndex];
          explanationPoints.push('Because you prefer a ' + prefLower + ' fit, sizing up to ' + recommendedSize + ' gives you the desired room and drape.');
        } else {
          explanationPoints.push('You prefer a ' + prefLower + ' fit, but ' + recommendedSize + ' is the largest size available. It may fit closer to standard.');
        }
      } else if (prefLower === 'slim' || prefLower === 'fitted') {
        if (isBorderlineLower && recommendedIndex > 0) {
          recommendedIndex--;
          recommendedSize = sizes[recommendedIndex];
          explanationPoints.push('Your measurement is on the lower end of ' + baseSize + '. Because you prefer a ' + prefLower + ' fit, ' + recommendedSize + ' ensures a closer, tailored cut.');
        } else {
           explanationPoints.push('Sticking with ' + recommendedSize + ' provides the structured fit suitable for your ' + prefLower + ' preference.');
        }
      } else {
        // Regular fit
        if (isBorderlineUpper) {
          explanationPoints.push('Your measurement falls near the upper end of ' + recommendedSize + ', providing a precise regular fit.');
        } else {
          explanationPoints.push(recommendedSize + ' provides a comfortable, true-to-size fit for your dimensions.');
        }
      }
      
      return {
        recommendedSize: recommendedSize,
        confidence: 'Good match',
        explanation: explanationPoints.join(' ')
      };
    }
  };

  window.NexSizeAdvisor = NexSizeAdvisor;

})();
