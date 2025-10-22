import { expect } from 'chai';
import { findMax, findMin, removeDuplicates } from '../utils/arrayUtils.js';

describe('Array Utils', () => {
  describe('findMax()', () => {
    it('should find the maximum value in an array', () => {
      expect(findMax([1, 5, 3, 9, 2])).to.equal(9);
    });

    it('should work with negative numbers', () => {
      expect(findMax([-5, -1, -10, -3])).to.equal(-1);
    });

    it('should work with single element array', () => {
      expect(findMax([42])).to.equal(42);
    });

    it('should throw error if input is not an array', () => {
      expect(() => findMax('not an array')).to.throw('Input must be an array');
      expect(() => findMax(123)).to.throw('Input must be an array');
    });
  });

  describe('findMin()', () => {
    it('should find the minimum value in an array', () => {
      expect(findMin([1, 5, 3, 9, 2])).to.equal(1);
    });

    it('should work with negative numbers', () => {
      expect(findMin([-5, -1, -10, -3])).to.equal(-10);
    });

    it('should work with single element array', () => {
      expect(findMin([42])).to.equal(42);
    });

    it('should throw error if input is not an array', () => {
      expect(() => findMin('not an array')).to.throw('Input must be an array');
      expect(() => findMin(null)).to.throw('Input must be an array');
    });
  });

  describe('removeDuplicates()', () => {
    it('should remove duplicate values from array', () => {
      expect(removeDuplicates([1, 2, 2, 3, 3, 3, 4])).to.deep.equal([1, 2, 3, 4]);
    });

    it('should work with strings', () => {
      expect(removeDuplicates(['a', 'b', 'a', 'c', 'b'])).to.deep.equal(['a', 'b', 'c']);
    });

    it('should return empty array for empty input', () => {
      expect(removeDuplicates([])).to.deep.equal([]);
    });

    it('should return same array if no duplicates', () => {
      expect(removeDuplicates([1, 2, 3, 4])).to.deep.equal([1, 2, 3, 4]);
    });

    it('should throw error if input is not an array', () => {
      expect(() => removeDuplicates('not an array')).to.throw('Input must be an array');
    });
  });
});

