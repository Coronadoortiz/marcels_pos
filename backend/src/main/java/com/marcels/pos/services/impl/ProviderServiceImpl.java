package com.marcels.pos.services.impl;

import com.marcels.pos.models.entities.Provider;
import com.marcels.pos.models.repositories.ProviderRepository;
import com.marcels.pos.services.ProviderService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service // Tells Spring Boot to manage this class as a core business service bean
public class ProviderServiceImpl implements ProviderService {

    private final ProviderRepository providerRepository;

    // Constructor injection: The professional way to inject repositories (No @Autowired needed!)
    public ProviderServiceImpl(ProviderRepository providerRepository) {
        this.providerRepository = providerRepository;
    }

    @Override
    public List<Provider> getAllProviders() {
        return providerRepository.findAll();
    }

    @Override
    public Provider getProviderById(Long id) {
        return providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found with ID: " + id));
    }

    @Override
    public Provider saveProvider(Provider provider) {
        return providerRepository.save(provider);
    }

    @Override
    public Provider updateProvider(Long id, Provider providerDetails) {
        Provider existingProvider = getProviderById(id);
        
        // Update the fields mapping directly from your entity attributes
        existingProvider.setNitProvider(providerDetails.getNitProvider());
        existingProvider.setNameProvider(providerDetails.getNameProvider());
        existingProvider.setPhoneNumber(providerDetails.getPhoneNumber());
        existingProvider.setEmail(providerDetails.getEmail());
        
        return providerRepository.save(existingProvider);
    }

    @Override
    public void deleteProvider(Long id) {
        Provider existingProvider = getProviderById(id);
        providerRepository.delete(existingProvider);
    }
}