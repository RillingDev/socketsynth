package org.felixrilling.socketsynth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class SocketsynthApplication {

	public static void main(String[] args) {
		SpringApplication.run(SocketsynthApplication.class, args);
	}

}
