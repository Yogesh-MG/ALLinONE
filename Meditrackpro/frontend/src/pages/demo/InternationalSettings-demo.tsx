
import React from "react";
import { Globe, Calendar, Banknote, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const InternationalSettingsdemo = () => {
  return (
    <Card>
      <div className="space-y-6 p-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <Languages className="mr-2 h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">Language Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interface-language">Interface Language</Label>
              <Select defaultValue="en">
                <SelectTrigger id="interface-language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">This changes the language of the user interface</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content-language">Content Language</Label>
              <Select defaultValue="en">
                <SelectTrigger id="content-language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">This changes the language of generated content and reports</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Auto-Translate Reports</Label>
                <p className="text-sm text-muted-foreground">Automatically translate reports to the preferred language</p>
              </div>
              <Switch id="auto-translate" defaultChecked />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center">
            <Globe className="mr-2 h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">Regional Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select defaultValue="north-america">
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north-america">North America</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                  <SelectItem value="latin-america">Latin America</SelectItem>
                  <SelectItem value="middle-east">Middle East & Africa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="est">
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="est">Eastern Time (ET / UTC-5)</SelectItem>
                  <SelectItem value="cst">Central Time (CT / UTC-6)</SelectItem>
                  <SelectItem value="mst">Mountain Time (MT / UTC-7)</SelectItem>
                  <SelectItem value="pst">Pacific Time (PT / UTC-8)</SelectItem>
                  <SelectItem value="gmt">Greenwich Mean Time (GMT / UTC+0)</SelectItem>
                  <SelectItem value="cet">Central European Time (CET / UTC+1)</SelectItem>
                  <SelectItem value="ist">India Standard Time (IST / UTC+5:30)</SelectItem>
                  <SelectItem value="jst">Japan Standard Time (JST / UTC+9)</SelectItem>
                  <SelectItem value="aest">Australian Eastern Time (AEST / UTC+10)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Localize Content</Label>
                <p className="text-sm text-muted-foreground">Adjust content to match regional standards and practices</p>
              </div>
              <Switch id="localize-content" defaultChecked />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">Date & Time Format</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Date Format</Label>
              <RadioGroup defaultValue="mm-dd-yyyy">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mm-dd-yyyy" id="mm-dd-yyyy" />
                  <Label htmlFor="mm-dd-yyyy">MM/DD/YYYY (e.g., 05/15/2023)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dd-mm-yyyy" id="dd-mm-yyyy" />
                  <Label htmlFor="dd-mm-yyyy">DD/MM/YYYY (e.g., 15/05/2023)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yyyy-mm-dd" id="yyyy-mm-dd" />
                  <Label htmlFor="yyyy-mm-dd">YYYY-MM-DD (e.g., 2023-05-15)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Time Format</Label>
              <RadioGroup defaultValue="12hour">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="12hour" id="12hour" />
                  <Label htmlFor="12hour">12-hour (e.g., 2:30 PM)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="24hour" id="24hour" />
                  <Label htmlFor="24hour">24-hour (e.g., 14:30)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>First Day of Week</Label>
              <Select defaultValue="sunday">
                <SelectTrigger>
                  <SelectValue placeholder="Select first day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunday">Sunday</SelectItem>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center">
            <Banknote className="mr-2 h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">Currency & Number Formats</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Primary Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">US Dollar (USD)</SelectItem>
                  <SelectItem value="eur">Euro (EUR)</SelectItem>
                  <SelectItem value="gbp">British Pound (GBP)</SelectItem>
                  <SelectItem value="jpy">Japanese Yen (JPY)</SelectItem>
                  <SelectItem value="cad">Canadian Dollar (CAD)</SelectItem>
                  <SelectItem value="aud">Australian Dollar (AUD)</SelectItem>
                  <SelectItem value="inr">Indian Rupee (INR)</SelectItem>
                  <SelectItem value="cny">Chinese Yuan (CNY)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Decimal Separator</Label>
              <RadioGroup defaultValue="period">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="period" id="period" />
                  <Label htmlFor="period">Period (e.g., 1,234.56)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comma" id="comma" />
                  <Label htmlFor="comma">Comma (e.g., 1.234,56)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Thousands Separator</Label>
              <RadioGroup defaultValue="comma">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comma" id="t-comma" />
                  <Label htmlFor="t-comma">Comma (e.g., 1,234.56)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="period" id="t-period" />
                  <Label htmlFor="t-period">Period (e.g., 1.234,56)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="space" id="t-space" />
                  <Label htmlFor="t-space">Space (e.g., 1 234.56)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="t-none" />
                  <Label htmlFor="t-none">None (e.g., 123456)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency-display">Currency Display</Label>
              <Select defaultValue="symbol">
                <SelectTrigger id="currency-display">
                  <SelectValue placeholder="Select display" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="symbol">Symbol ($100.00)</SelectItem>
                  <SelectItem value="code">Code (USD 100.00)</SelectItem>
                  <SelectItem value="name">Name (100.00 US Dollars)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Show Secondary Currency</Label>
                <p className="text-sm text-muted-foreground">Display amounts in a secondary currency</p>
              </div>
              <Switch id="secondary-currency" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondary-currency-select">Secondary Currency</Label>
              <Select defaultValue="eur" disabled>
                <SelectTrigger id="secondary-currency-select">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eur">Euro (EUR)</SelectItem>
                  <SelectItem value="usd">US Dollar (USD)</SelectItem>
                  <SelectItem value="gbp">British Pound (GBP)</SelectItem>
                  <SelectItem value="jpy">Japanese Yen (JPY)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </Card>
  );
};

export default InternationalSettingsdemo;
