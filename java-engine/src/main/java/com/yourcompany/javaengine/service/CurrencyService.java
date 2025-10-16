package com.yourcompany.javaengine.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CurrencyService {

    @Autowired
    private RestTemplate restTemplate;

    private final String API_KEY = "07d07fbbc0f5ac6061a73f13"; // ใส่ของคุณเอง
    private final String BASE_URL = "https://v6.exchangerate-api.com/v6/" + API_KEY;

    @SuppressWarnings("unchecked")
    public double convert(String from, String to, double amount) {
        try {
            String url = BASE_URL + "/pair/" + from.toUpperCase() + "/" + to.toUpperCase();
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response != null && "success".equals(response.get("result"))) {
                double rate = Double.parseDouble(response.get("conversion_rate").toString());
                return amount * rate;
            }

            throw new RuntimeException("Could not get exchange rates from API.");

        } catch (Exception e) {
            throw new RuntimeException("Error fetching exchange rates: " + e.getMessage(), e);
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Double> getAllCurrencies() {
        try {
            String url = BASE_URL + "/latest/USD";
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response != null && "success".equals(response.get("result"))) {
                Map<String, Object> rawRates = (Map<String, Object>) response.get("conversion_rates");

                // แปลงทุกค่าเป็น Double
                return rawRates.entrySet()
                        .stream()
                        .collect(Collectors.toMap(
                                Map.Entry::getKey,
                                e -> Double.parseDouble(e.getValue().toString())
                        ));
            }

            throw new RuntimeException("Could not get currencies from API.");

        } catch (Exception e) {
            throw new RuntimeException("Error fetching currencies: " + e.getMessage(), e);
        }
    }
}
