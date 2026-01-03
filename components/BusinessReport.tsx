import React from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";
import { BusinessState, BusinessIdea } from "../types/business";

// Styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica"
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold"
  },
  subheader: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: "bold"
  },
  section: {
    marginBottom: 15
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 3,
    marginBottom: 3
  },
  tableRow: {
    flexDirection: "row",
    paddingBottom: 2
  },
  tableCell: {
    flex: 1
  },
  bold: {
    fontWeight: "bold"
  }
});

interface Props {
  business: BusinessState;
}

const IdeaTable: React.FC<{ idea: BusinessIdea }> = ({ idea }) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={styles.subheader}>{idea.name}</Text>
    <Text>{idea.description}</Text>
    <Text style={{ fontStyle: "italic" }}>{idea.rationale}</Text>

    <View style={{ flexDirection: "row", marginTop: 5 }}>
      <View style={{ flex: 1 }}>
        <Text style={styles.bold}>Market Scores</Text>
        <Text>Demand: {idea.market.demand}</Text>
        <Text>Competition: {idea.market.competition}</Text>
        <Text>Saturation: {idea.market.saturation}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.bold}>Feasibility Scores</Text>
        <Text>Profitability: {idea.feasibility.profitability}</Text>
        <Text>Difficulty: {idea.feasibility.difficulty}</Text>
        <Text>Entry Barriers: {idea.feasibility.entryBarriers}</Text>
      </View>
    </View>

    <Text style={{ marginTop: 5 }}>
      Fit Score: {idea.fitScore} | Viability Score: {idea.viabilityScore} | Recommendation: {idea.recommendation.toUpperCase()}
    </Text>
  </View>
);

export const BusinessReport: React.FC<Props> = ({ business }) => {
  return (
    <PDFDownloadLink
      document={
        <Document>
          <Page size="A4" style={styles.page}>
            <Text style={styles.header}>Business Viability Report</Text>
            <View style={styles.section}>
              <Text style={styles.bold}>Founder Profile:</Text>
              <Text>Skills: {business.founder.skills.join(", ")}</Text>
              <Text>Experience Level: {business.founder.experienceLevel}</Text>
              <Text>Budget: ${business.founder.budget}</Text>
              <Text>Time per Week: {business.founder.timePerWeek} hours</Text>
              <Text>Risk Tolerance: {business.founder.riskTolerance}</Text>
              <Text>Goal: {business.founder.goals}</Text>
              <Text>Location: {business.founder.location}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.subheader}>Business Ideas</Text>
              {business.ideas.map((idea) => (
                <IdeaTable key={idea.id} idea={idea} />
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.subheader}>Next Best Actions</Text>
              <Text>1. Validate your top idea with at least 10 potential customers.</Text>
              <Text>2. Build a simple landing page to test demand.</Text>
              <Text>3. Set up early metrics tracking for traffic & sign-ups.</Text>
              <Text>4. Iterate pricing based on initial feedback.</Text>
              <Text>5. Plan first marketing campaigns.</Text>
            </View>
          </Page>
        </Document>
      }
      fileName={`BusinessReport-${business.createdAt}.pdf`}
    >
      {({ loading }) => (
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg" disabled={loading}>
          {loading ? "Generating PDF..." : "Download Business Report"}
        </button>
      )}
    </PDFDownloadLink>
  );
};
