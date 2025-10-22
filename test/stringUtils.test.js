import { expect } from 'chai';
import { capitalize, reverseString, isPalindrome } from '../utils/stringUtils.js';

describe('String Utils', () => {
  describe('capitalize()', () => {
    it('should capitalize first letter of string', () => {
      expect(capitalize('hello')).to.equal('Hello');
    });

    it('should work with already capitalized string', () => {
      expect(capitalize('Hello')).to.equal('Hello');
    });

    it('should work with single character', () => {
      expect(capitalize('a')).to.equal('A');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).to.equal('');
    });

    it('should throw error if input is not a string', () => {
      expect(() => capitalize(123)).to.throw('Input must be a string');
      expect(() => capitalize(null)).to.throw('Input must be a string');
    });
  });

  describe('reverseString()', () => {
    it('should reverse a string', () => {
      expect(reverseString('hello')).to.equal('olleh');
    });

    it('should handle single character', () => {
      expect(reverseString('a')).to.equal('a');
    });

    it('should handle empty string', () => {
      expect(reverseString('')).to.equal('');
    });

    it('should work with palindromes', () => {
      expect(reverseString('racecar')).to.equal('racecar');
    });

    it('should throw error if input is not a string', () => {
      expect(() => reverseString(123)).to.throw('Input must be a string');
      expect(() => reverseString([])).to.throw('Input must be a string');
    });
  });

  describe('isPalindrome()', () => {
    it('should return true for palindrome strings', () => {
      expect(isPalindrome('racecar')).to.be.true;
      expect(isPalindrome('madam')).to.be.true;
    });

    it('should return false for non-palindrome strings', () => {
      expect(isPalindrome('hello')).to.be.false;
      expect(isPalindrome('world')).to.be.false;
    });

    it('should handle single character', () => {
      expect(isPalindrome('a')).to.be.true;
    });

    it('should handle empty string', () => {
      expect(isPalindrome('')).to.be.true;
    });

    it('should throw error if input is not a string', () => {
      expect(() => isPalindrome(123)).to.throw('Input must be a string');
      expect(() => isPalindrome(undefined)).to.throw('Input must be a string');
    });
  });
});

