package com.yourcompany.javaengine;

import org.mariuszgromada.math.mxparser.License;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class JavaEngineApplication {
    public static void main(String[] args) {
        License.iConfirmNonCommercialUse("Javara Project");
        SpringApplication.run(JavaEngineApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
