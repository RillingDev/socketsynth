package org.felixrilling.socketsynth;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("app.socketsynth")
public class AppProperties {
    private String wsOrigin = null;

    public String getWsOrigin() {
        return wsOrigin;
    }

    public void setWsOrigin(String wsOrigin) {
        this.wsOrigin = wsOrigin;
    }
}
