import { describe, it, expect, vi, beforeEach } from 'vitest';
const LeadService = require('../../src/domain/services/LeadService');

describe('LeadService', () => {
  let leadService;
  let leadRepository;
  let auditService;
  let logger;

  beforeEach(() => {
    leadRepository = {
      findAll: vi.fn(),
      delete: vi.fn(),
    };
    auditService = {
      log: vi.fn(),
    };
    logger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    leadService = new LeadService({ leadRepository, auditService, logger });
  });

  it('should forget lead if found', async () => {
    const email = 'test@example.com';
    leadRepository.findAll.mockResolvedValue([{ id: '1', email }]);
    leadRepository.delete.mockResolvedValue({});

    const result = await leadService.forgetLead(email);

    expect(result.count).toBe(1);
    expect(leadRepository.delete).toHaveBeenCalledWith('1');
    expect(auditService.log).toHaveBeenCalledWith(expect.objectContaining({
      action: 'GDPR_FORGET_LEAD',
      entityId: email,
    }));
  });

  it('should return 0 if lead not found', async () => {
    const email = 'notfound@example.com';
    leadRepository.findAll.mockResolvedValue([]);

    const result = await leadService.forgetLead(email);

    expect(result.count).toBe(0);
    expect(leadRepository.delete).not.toHaveBeenCalled();
    expect(auditService.log).not.toHaveBeenCalled();
  });
});
