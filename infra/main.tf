provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "app_rg" {
  name     = "gestion-boisson-rg"
  location = "East US"
}

resource "azurerm_app_service_plan" "app_sp" {
  name                = "gestion-boisson-asp"
  location            = azurerm_resource_group.app_rg.location
  resource_group_name = azurerm_resource_group.app_rg.name
  kind                = "Linux"
  reserved            = true
  sku {
    tier = "Basic"
    size = "B1"
  }
}

resource "azurerm_app_service" "app" {
  name                = "gestion-boisson-app"
  location            = azurerm_resource_group.app_rg.location
  resource_group_name = azurerm_resource_group.app_rg.name
  app_service_plan_id = azurerm_app_service_plan.app_sp.id

  site_config {
    linux_fx_version = "DOCKER|${var.docker_image}"
  }
  app_settings = {
    WEBSITES_PORT = "80"
  }
}

variable "docker_image" {
  description = "Docker image to deploy"
  type        = string
}

