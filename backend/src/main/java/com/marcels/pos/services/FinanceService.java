package com.marcels.pos.services;

import com.marcels.pos.models.dtos.FinanceReportDTO;

public interface FinanceService {
    FinanceReportDTO getGlobalFinancialReport();
}