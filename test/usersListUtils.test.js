import { expect } from 'chai';
import {
  filterUsersByAge,
  sortUsersByName,
  findUserById,
  isEmailTaken,
} from '../utils/usersListUtils.js';

describe('Users List Utils', () => {
  const users = [
    { id: 1, name: 'Charlie', age: 25, email: 'charlie@example.com' },
    { id: 2, name: 'Alice', age: 30, email: 'alice@example.com' },
    { id: 3, name: 'Bob', age: 20, email: 'bob@example.com' },
    { id: 4, name: 'David', age: 35, email: 'david@example.com' },
    { id: 5, name: 'Eve', age: 28, email: 'eve@example.com' },
  ];

  describe('filterUsersByAge()', () => {
    it('should filter users within age range', () => {
      const result = filterUsersByAge(users, 25, 30);
      expect(result).to.have.lengthOf(3);
      expect(result.map(u => u.name)).to.include.members(['Charlie', 'Alice', 'Eve']);
    });

    it('should return empty array when no users match', () => {
      const result = filterUsersByAge(users, 40, 50);
      expect(result).to.be.an('array').that.is.empty;
    });

    it('should include boundary ages', () => {
      const result = filterUsersByAge(users, 20, 20);
      expect(result).to.have.lengthOf(1);
      expect(result[0].name).to.equal('Bob');
    });

    it('should return all users if range covers all ages', () => {
      const result = filterUsersByAge(users, 0, 100);
      expect(result).to.have.lengthOf(5);
    });

    it('should throw error if users is not an array', () => {
      expect(() => filterUsersByAge('not an array', 20, 30)).to.throw('Users must be an array');
      expect(() => filterUsersByAge(null, 20, 30)).to.throw('Users must be an array');
    });
  });

  describe('sortUsersByName()', () => {
    it('should sort users alphabetically by name', () => {
      const result = sortUsersByName(users);
      const names = result.map(u => u.name);
      expect(names).to.deep.equal(['Alice', 'Bob', 'Charlie', 'David', 'Eve']);
    });

    it('should not modify original array', () => {
      const originalLength = users.length;
      sortUsersByName(users);
      expect(users).to.have.lengthOf(originalLength);
      expect(users[0].name).to.equal('Charlie'); // Original order preserved
    });

    it('should work with single user', () => {
      const singleUser = [{ id: 1, name: 'Solo', age: 25, email: 'solo@example.com' }];
      const result = sortUsersByName(singleUser);
      expect(result).to.have.lengthOf(1);
    });

    it('should work with empty array', () => {
      const result = sortUsersByName([]);
      expect(result).to.be.an('array').that.is.empty;
    });

    it('should throw error if users is not an array', () => {
      expect(() => sortUsersByName('not an array')).to.throw('Users must be an array');
    });
  });

  describe('findUserById()', () => {
    it('should find user by id', () => {
      const result = findUserById(users, 3);
      expect(result).to.not.be.null;
      expect(result.name).to.equal('Bob');
    });

    it('should return null when user not found', () => {
      const result = findUserById(users, 999);
      expect(result).to.be.null;
    });

    it('should find first user', () => {
      const result = findUserById(users, 1);
      expect(result.name).to.equal('Charlie');
    });

    it('should find last user', () => {
      const result = findUserById(users, 5);
      expect(result.name).to.equal('Eve');
    });

    it('should throw error if users is not an array', () => {
      expect(() => findUserById('not an array', 1)).to.throw('Users must be an array');
      expect(() => findUserById(null, 1)).to.throw('Users must be an array');
    });
  });

  describe('isEmailTaken()', () => {
    it('should return true when email exists', () => {
      expect(isEmailTaken(users, 'alice@example.com')).to.be.true;
      expect(isEmailTaken(users, 'bob@example.com')).to.be.true;
    });

    it('should return false when email does not exist', () => {
      expect(isEmailTaken(users, 'notfound@example.com')).to.be.false;
      expect(isEmailTaken(users, 'test@test.com')).to.be.false;
    });

    it('should be case sensitive', () => {
      expect(isEmailTaken(users, 'ALICE@EXAMPLE.COM')).to.be.false;
    });

    it('should return false for empty users array', () => {
      expect(isEmailTaken([], 'any@example.com')).to.be.false;
    });

    it('should throw error if users is not an array', () => {
      expect(() => isEmailTaken('not an array', 'test@test.com')).to.throw('Users must be an array');
      expect(() => isEmailTaken(undefined, 'test@test.com')).to.throw('Users must be an array');
    });
  });
});

