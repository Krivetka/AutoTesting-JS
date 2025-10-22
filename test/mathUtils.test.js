import { expect } from 'chai';
import { add, subtract, multiply, divide } from '../utils/mathUtils.js';

describe('Math Utils', () => {
  describe('add()', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).to.equal(5);
    });

    it('should add negative numbers', () => {
      expect(add(-2, -3)).to.equal(-5);
    });
  });

  describe('subtract()', () => {
    it('should subtract two numbers', () => {
      expect(subtract(5, 3)).to.equal(2);
    });
  });

  describe('multiply()', () => {
    it('should multiply two numbers', () => {
      expect(multiply(4, 5)).to.equal(20);
    });
  });

  describe('divide()', () => {
    it('should divide two numbers', () => {
      expect(divide(10, 2)).to.equal(5);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => divide(10, 0)).to.throw('Cannot divide by zero');
    });
  });
});

