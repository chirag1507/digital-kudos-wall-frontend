import React from "react";
import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";

export interface Kudo {
  id: string;
  category: string;
  from: string;
  to: string;
  toProfilePicture?: string;
  message: string;
  fromProfilePicture?: string;
  date: string;
}

interface KudosCardProps {
  kudo: Kudo;
}

const KudosCard: React.FC<KudosCardProps> = ({ kudo }) => {
  return (
    <Card sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {kudo.category}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <Avatar sx={{ mr: 1 }} src={kudo.toProfilePicture} />
          <Typography variant="body1">{kudo.to}</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {kudo.message}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ mr: 1, width: 24, height: 24 }} src={kudo.fromProfilePicture} />
            <Typography variant="caption" color="text.secondary">
              From: {kudo.from}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {kudo.date}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KudosCard;
