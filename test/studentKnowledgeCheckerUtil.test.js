import { expect } from 'chai';
import { checkStudentKnowledge } from '../utils/studentKnowledgeCheckerUtil.js';

describe('Student Knowledge Checker', () => {
  describe('checkStudentKnowledge()', () => {
    it('should return true when all answers are correct', () => {
      const studentAnswers = {
        question1: 'answer1',
        question2: 'answer2',
        question3: 'answer3',
      };
      const correctAnswers = {
        question1: 'answer1',
        question2: 'answer2',
        question3: 'answer3',
      };
      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.true;
    });

    it('should return false when answer values are wrong', () => {
      const studentAnswers = {
        question1: 'answer1',
        question2: 'wrong',
        question3: 'answer3',
      };
      const correctAnswers = {
        question1: 'answer1',
        question2: 'answer2',
        question3: 'answer3',
      };
      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.false;
    });

    it('should return false when number of answers differs', () => {
      const studentAnswers = {
        question1: 'answer1',
        question2: 'answer2',
      };
      const correctAnswers = {
        question1: 'answer1',
        question2: 'answer2',
        question3: 'answer3',
      };
      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.false;
    });

    it('should return false when question keys are different', () => {
      const studentAnswers = {
        question1: 'answer1',
        question2: 'answer2',
        wrongKey: 'answer3',
      };
      const correctAnswers = {
        question1: 'answer1',
        question2: 'answer2',
        question3: 'answer3',
      };
      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.false;
    });

    it('should return true for empty objects', () => {
      const studentAnswers = {};
      const correctAnswers = {};
      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.true;
    });

    it('should return true for single question-answer pair', () => {
      const studentAnswers = { q1: 'a1' };
      const correctAnswers = { q1: 'a1' };
      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.true;
    });
  });
});

