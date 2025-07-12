provider "azurerm" {
  features {}
}

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
}

# Variables
variable "docker_image" {
  description = "Docker image to deploy"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "East US"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = "rg-gestion-boisson-${var.environment}"
  location = var.location

  tags = {
    Environment = var.environment
    Application = "gestion-boisson"
  }
}

# App Service Plan
resource "azurerm_service_plan" "main" {
  name                = "asp-gestion-boisson-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = "F1"  # Free tier for student account

  tags = {
    Environment = var.environment
    Application = "gestion-boisson"
  }
}

# Container Registry (optional, can use Docker Hub instead)
resource "azurerm_container_registry" "main" {
  name                = "acrgestionboisson${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true

  tags = {
    Environment = var.environment
    Application = "gestion-boisson"
  }
}

# Web App
resource "azurerm_linux_web_app" "main" {
  name                = "app-gestion-boisson-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  service_plan_id     = azurerm_service_plan.main.id

  site_config {
    always_on = false  # Free tier doesn't support always_on

    application_stack {
      docker_image     = var.docker_image
      docker_image_tag = "latest"
    }
  }

  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "DOCKER_REGISTRY_SERVER_URL"          = "https://index.docker.io/v1/"
    "WEBSITES_PORT"                       = "80"
  }

  tags = {
    Environment = var.environment
    Application = "gestion-boisson"
  }
}

# Application Insights
resource "azurerm_application_insights" "main" {
  name                = "appi-gestion-boisson-${var.environment}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  application_type    = "web"

  tags = {
    Environment = var.environment
    Application = "gestion-boisson"
  }
}

# Outputs
output "web_app_url" {
  value = "https://${azurerm_linux_web_app.main.default_hostname}"
}

output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "container_registry_login_server" {
  value = azurerm_container_registry.main.login_server
}
