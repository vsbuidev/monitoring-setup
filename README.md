# Multi-Service App Monitoring Stack with Prometheus, Grafana, Loki & Alertmanager

This project implements a full-stack web application and a robust observability pipeline using:

- **Prometheus** for metrics scraping
- **Grafana** for visualization
- **Alertmanager** for alerts
- **Loki + Promtail** for log aggregation
- **Docker Compose** to orchestrate everything

## Project Structure

```
.
├── frontend/               # Vite-based app
├── backend/                # Node.js api
|── cache/                  # Redis cache
├── db/                     # MongoDB data
├── proxy/                  # Nginx reverse proxy
├── monitoring/
│   ├── prometheus.yml      # Prometheus scrape config
│   └── alertmanager.yml    # Alertmanager rules
|   └── alert.rules.yml     # Alertmanager rules
├── loki/
│   ├── loki-config.yml     # Loki configuration
│   └── promtail-config.yml # Promtail configuration
|── Screenshots             # screenshots of Grafana dashboards
├── docker-compose.yml
```

---

## Services Overview

| Service          | Description                                | Port  |
| ---------------- | ------------------------------------------ | ----- |
| `frontend`       | Vite frontend app                          | 5173  |
| `backend`        | Node.js API connected to MongoDB and Redis | 5000  |
| `proxy`          | Nginx reverse proxy                        | 80    |
| `database`       | MongoDB database                           | 27017 |
| `cache`          | Redis key-value store                      | 6379  |
| `prometheus`     | Metrics scraping and alert evaluation      | 9090  |
| `grafana`        | Dashboards & visualizations                | 3000  |
| `alertmanager`   | Alert delivery via email/Slack/etc.        | 9093  |
| `loki`           | Log aggregator                             | 3100  |
| `promtail`       | Log shipper for containers                 | 9080  |
| `mongo-exporter` | Exposes MongoDB metrics for Prometheus     | 9216  |
| `redis-exporter` | Exposes Redis metrics for Prometheus       | 9121  |
| `node-exporter`  | Host-level system metrics                  | 9100  |

---

## Prerequisites

- Docker & Docker Compose installed
- Optional: `.env` file for Alertmanager SMTP settings:
  ```
  SMTP_USERNAME=your@email.com
  SMTP_PASSWORD=your-app-password
  ```

---

## How to Run

1. **Clone the repo**

   ```bash
   git clone https://github.com/vsbuidev/monitoring-setup.git
   cd monitoring-setup
   ```

2. **Build and run the stack**

   ```bash
   docker compose up -d --build
   ```

3. **Access Services:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - Grafana: http://localhost:3000 (default user: `admin` / `admin`)
   - Prometheus: http://localhost:9090
   - Alertmanager: http://localhost:9093
   - Loki Logs (via Grafana Explore tab)

---

## Observability Setup

### Metrics Collection

- **Prometheus** scrapes metrics from:
  - `node-exporter`: system metrics
  - `redis-exporter`, `mongo-exporter`: DB metrics
  - Custom app metrics (if instrumented)

### Dashboards

- Import dashboards from [Grafana.com](https://grafana.com/grafana/dashboards)
  - Node Exporter Full: ID `1860`
  - MongoDB: ID `2583`
  - Redis: ID `11835`
  - Loki: ID `11559`

### Alerts

- Alert rules in `monitoring/alertmanager.yml`
- Email notifications via SMTP (Gmail or custom)

### Logs

- **Promtail** ships logs from Docker containers
- **Loki** stores and indexes logs
- Explore logs in Grafana (`Explore` tab)

---

## Troubleshooting

- If Email not sending.? Ensure your SMTP credentials are valid and [App Passwords](https://myaccount.google.com/apppasswords) are enabled for Gmail if used.

---

## Improvements

- To add custom application metrics using `prom-client`
- Set up Slack / Discord alert routing
- Configure recording rules for Prometheus
- Automate provisioning with Terraform/Ansible
- Create prebuilt Grafana dashboards with provisioning

---

## Attribution

- This project is based on the roadmap provided in the [DevOps Roadmap Project](https://roadmap.sh/projects/monitoring)
