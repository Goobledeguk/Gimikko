import java.util.Scanner;

public class PayrollSystem {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Input gathering
        System.out.print("Enter Employee Name: ");
        String name = scanner.nextLine();

        System.out.print("Enter Employee Type (1 for Private, 2 for Government): ");
        int empType = scanner.nextInt();

        System.out.print("Enter Monthly Gross Salary: ");
        double grossSalary = scanner.nextDouble();

        // 1. SSS (Private) or GSIS (Government) Calculation
        double sssGsis = 0.0;
        if (empType == 1) {
            // SSS Employee Share: 4.5% capped at ₱1,350.00
            sssGsis = Math.min(grossSalary * 0.045, 1350.0);
        } else {
            // GSIS Employee Share: 9.0%
            sssGsis = grossSalary * 0.09;
        }

        // 2. Pag-IBIG Contribution (2% capped at ₱200.00)
        double pagIbig = Math.min(grossSalary * 0.02, 200.0);

        // 3. PhilHealth Contribution (2.5% employee share)
        double philHealth = grossSalary * 0.025;

        // Taxable Income Calculation
        double taxableIncome = grossSalary - (sssGsis + pagIbig + philHealth);

        // 4. BIR Withholding Tax (TRAIN Law Monthly Schedule)
        double birTax = 0.0;
        if (taxableIncome > 83333) {
            birTax = 11875 + (taxableIncome - 83333) * 0.25;
        } else if (taxableIncome > 33333) {
            birTax = 1875 + (taxableIncome - 33333) * 0.20;
        } else if (taxableIncome > 20833) {
            birTax = (taxableIncome - 20833) * 0.15;
        }

        // Final Totals
        double totalDeductions = sssGsis + pagIbig + philHealth + birTax;
        double netPay = grossSalary - totalDeductions;

        // Output Display
        System.out.println("\n----------------------------------------");
        System.out.println("PAYROLL SUMMARY FOR: " + name);
        System.out.println("Employee Type: " + (empType == 1 ? "Private" : "Government"));
        System.out.printf("Gross Salary: PHP %.2f\n", grossSalary);
        System.out.println("----------------------------------------");
        System.out.printf("%s Contribution: PHP %.2f\n", (empType == 1 ? "SSS" : "GSIS"), sssGsis);
        System.out.printf("Pag-IBIG Contribution: PHP %.2f\n", pagIbig);
        System.out.printf("PhilHealth Contribution: PHP %.2f\n", philHealth);
        System.out.printf("BIR Withholding Tax: PHP %.2f\n", birTax);
        System.out.println("----------------------------------------");
        System.out.printf("Total Deductions: PHP %.2f\n", totalDeductions);
        System.out.printf("Net Monthly Pay: PHP %.2f\n", netPay);
        System.out.println("----------------------------------------");

        scanner.close();
    }
}