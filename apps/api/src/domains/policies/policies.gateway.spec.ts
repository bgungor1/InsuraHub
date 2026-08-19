import type { Server } from 'socket.io';
import { PoliciesGateway } from './policies.gateway';

describe('PoliciesGateway', () => {
  let gateway: PoliciesGateway;
  let emitMock: jest.Mock;

  beforeEach(() => {
    gateway = new PoliciesGateway();
    emitMock = jest.fn();
    gateway.server = {
      emit: emitMock,
    } as unknown as Server;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should emit policy_created event', () => {
    gateway.broadcastPolicyCreated({
      policyId: 'p-1',
      product: 'KASKO',
      branchId: 'b-1',
    });
    expect(emitMock).toHaveBeenCalledWith('policy_created', {
      policyId: 'p-1',
      product: 'KASKO',
      branchId: 'b-1',
    });
  });

  it('should emit policy_claimed event', () => {
    gateway.broadcastPolicyClaimed('p-1', 'b-1');
    expect(emitMock).toHaveBeenCalledWith('policy_claimed', {
      policyId: 'p-1',
      brokerId: 'b-1',
    });
  });

  it('should emit policy_released event', () => {
    gateway.broadcastPolicyReleased('p-1');
    expect(emitMock).toHaveBeenCalledWith('policy_released', {
      policyId: 'p-1',
    });
  });

  it('should emit policy_completed event', () => {
    gateway.broadcastPolicyCompleted('p-1');
    expect(emitMock).toHaveBeenCalledWith('policy_completed', {
      policyId: 'p-1',
    });
  });
});
