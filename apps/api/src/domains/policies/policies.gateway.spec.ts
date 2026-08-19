import { PoliciesGateway } from './policies.gateway';

describe('PoliciesGateway', () => {
  let gateway: PoliciesGateway;

  beforeEach(() => {
    gateway = new PoliciesGateway();
    gateway.server = {
      emit: jest.fn(),
    } as any;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should emit policy_claimed event', () => {
    gateway.broadcastPolicyClaimed('p-1', 'b-1');
    expect(gateway.server.emit).toHaveBeenCalledWith('policy_claimed', {
      policyId: 'p-1',
      brokerId: 'b-1',
    });
  });

  it('should emit policy_released event', () => {
    gateway.broadcastPolicyReleased('p-1');
    expect(gateway.server.emit).toHaveBeenCalledWith('policy_released', {
      policyId: 'p-1',
    });
  });
});
