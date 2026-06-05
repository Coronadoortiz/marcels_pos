package com.marcels.pos.services;

import com.marcels.pos.models.entities.Provider;
import java.util.List;

public interface ProviderService {
    List<Provider> getAllProviders();
    Provider getProviderById(Long id);
    Provider saveProvider(Provider provider);
    Provider updateProvider(Long id, Provider providerDetails);
    void deleteProvider(Long id);
}
